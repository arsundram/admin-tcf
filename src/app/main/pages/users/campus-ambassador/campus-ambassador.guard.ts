import { Injectable } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class CampusAmbassadorGuard {
    constructor(private userService: UserService, private router: Router) {}
    canActivate() {
        return this.userService.checkIfIsAdmin('fest').then(res => {
            if (!res) {
                this.router.navigateByUrl('/pages/auth/login');
                }
            return res;
          }); 
    }
}
