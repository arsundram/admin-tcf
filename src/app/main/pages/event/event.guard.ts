import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '@fuse/services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { EventService } from '@fuse/services/event.service';
import { map } from 'rxjs/operators';
@Injectable({providedIn: 'root'})
export class EventGuard {
    constructor(private auth: AuthService, private router: Router, private afAuth: AngularFireAuth,
         private eventService: EventService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.permitAccesByEventTreeSearch(route.params['id']);
    }
    permitAccesByEventTreeSearch(eventId) {
        if (this.auth.user$.value && this.eventService.events.value) {
            return this.resolveOrReject(this.eventService.events.value, eventId);
        }
        return this.initialStateResolveOrReject(eventId);
    }
    findInsideEventTree(parent, eventId) {
        if ( parent && parent.url) {

            const url = parent.url.split('/');
            const checkerId = url[url.length - 1];
            if (checkerId === eventId) {
                return true;
            } 
        } else if (parent && parent.id && (parent.id === eventId)) {
            return true;
        }
        
       
        if (parent.children) {
           const check = parent.children.some(child => {
                return this.findInsideEventTree(child, eventId);
            });
            return check;
        }
        return false;
    }
    initialStateResolveOrReject(eventId) {
        return new Promise((resolve, reject) => {
            const sub = this.afAuth.authState.subscribe((user) => {
                if (user && user.uid) {
                     this.auth.getUserDetail(user.uid).then(detail => {
                        sub.unsubscribe();
                        if (detail.admin) {
                                 this.eventService.getEventTree(detail.admin).then(eventTree => {
                                    resolve(this.resolveOrReject(eventTree, eventId));
                                });
                        }
                        else  {
                            resolve(false);
                        }
                    });
                }
                else {
                     resolve(false);
                }
            });
            
         });
    }
    resolveOrReject( eventTree, eventId) {
        if (!this.findInsideEventTree(eventTree, eventId) ){
            this.router.navigateByUrl('/pages/errors/error-404');
             return false;
       }
       return true;
    }
}
