import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '@fuse/services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
@Injectable({providedIn: 'root'})
export class LoginGuard  {
    constructor(private auth: AuthService, private router: Router, private afAuth: AngularFireAuth) { }

     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
         if (this.auth.user$.value && this.auth.user$.value.uid) {
            return this.resolveOrReject(this.auth.user$.value.uid);
         }
        return this.afAuth.authState.pipe(map( user => {
            if (user && user.uid) {
                 return this.resolveOrReject(user.uid);
            }
            else {
                return true;
            }
        }));
    }

    resolveOrReject(uid) {
        this.auth.getUserDetail(uid).then(detail => {
            if (detail.admin) {
               this.router.navigateByUrl('pages/events/' + detail.admin);
            }
        });
        return false;
    }
}
