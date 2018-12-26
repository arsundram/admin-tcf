import { Injectable } from '@angular/core';
import { AuthService } from '@fuse/services/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { EventService } from '@fuse/services/event.service';
import { EventGuard } from '../event/event.guard';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class UserService {
    constructor(private auth: AuthService, private afAuth: AngularFireAuth, private router: Router) { }

         checkIfIsAdmin(accessLevel?) {
            if (this.auth.user$.value && this.auth.user$.value.uid) {
                return this.auth.getUserDetail(this.auth.user$.value.uid).then(res => {
                    return Promise.resolve(!!(res && res.admin) && (!accessLevel || (res.admin === accessLevel)));
                });
              } else {
                  return new Promise((resolve, reject) => {
                    const sub = this.afAuth.authState.subscribe(user => {
                    if (user && user.uid) {
                        this.auth.getUserDetail(user.uid).then(res => {
                        resolve(!!((res && res.admin) && 
                        ((accessLevel && (res.admin === accessLevel)) || !accessLevel)));
                        }).catch(() => { 
                        resolve(false);
                        });
                    } else {
                        resolve(false);
                    }
                    sub.unsubscribe();
                }, e => resolve(false));
                  });
              }
         }
}
