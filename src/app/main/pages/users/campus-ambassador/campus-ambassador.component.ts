import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { MatSort } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { PageService } from './../../pages.service';
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { UserService } from '../user.service';
@Component({
    selector: 'app-campus-ambassador',
    templateUrl: './campus-ambassador.component.html',
    styleUrls: ['./campus-ambassador.component.scss'],
      encapsulation: ViewEncapsulation.None,
      animations   : fuseAnimations
  
  })

  export class CampusAmbassadorComponent {
    allCampusAmbassadors = [];
    filteredCampusAmbassadors = new BehaviorSubject([]);
    columns = ['points', 'name', 'collegeName', 'email', 'native'];

      currentPage = 0;
      currentPageSize = 50;
      @ViewChild(MatSort) sort: MatSort;
    constructor(private userService: UserService, private pageService: PageService, private splash: FuseSplashScreenService) {
        this.splash.show();
        this.userService.getCampusAmbassadorList().then(res => {
            this.allCampusAmbassadors = Object.keys(res).map(k => {
                return {uid: k, ...res[k]};
            });
            this.filteredCampusAmbassadors.next(this.allCampusAmbassadors.slice(0, 50));
            this.splash.hide();
        });

    }
    sortInput(e) {
        console.log(e);
        const descending = e.direction === 'desc' ? true : false;
        switch (e.active) {
            case 'points':
            this.allCampusAmbassadors.sort((a, b) => {
                return a.points - b.points;
            });
            break;
            case 'name':
            this.allCampusAmbassadors.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
            break;
            case 'collegeName':
            this.allCampusAmbassadors.sort((a, b) => {
                return a.collegeName.localeCompare(b.collegeName);
            });
            break;
            case 'email':
            this.allCampusAmbassadors.sort((a, b) => {
                return a.email.localeCompare(b.email);
            });
            break;
            case 'native':
            this.allCampusAmbassadors.sort((a, b) => {
               return  a.collegeId === 'nitp' ? 1 : b.collegeId === 'nitp' ? -1 : 0 ;
            });
            break;
            default:
        }
        if (descending) {
            this.allCampusAmbassadors.reverse();
        }
        this.filteredCampusAmbassadors.next(this.allCampusAmbassadors.
            slice(this.currentPage * this.currentPageSize, this.currentPage + 1 * this.currentPageSize));
    }
    paginate(e) {
        const newIndex = e.pageIndex, newSize = e.pageSize;
        this.filteredCampusAmbassadors.next(this.allCampusAmbassadors.slice(newIndex * newSize, (newIndex + 1) * newSize ));
    }
    changePoints(uid, shouldIncrease) {
        this.userService.changeAmbassadorPoints(uid, shouldIncrease)
        .then((points) => {
           this.changeCurrent(uid, points);
           this.pageService.openSnackBar(`Points  ${shouldIncrease ? 'increased' : 'decreased'}`);
        })
        .catch(e => {
            this.pageService.openSnackBar('Points updation failed');
        });
    }

    changeCurrent(uid, points) {
        const allIndex = this.allCampusAmbassadors.findIndex(el => {
            return !!(el.uid === uid);
        });
        if (allIndex !== -1) {
            this.allCampusAmbassadors[allIndex].points = points;
        }
        const filteredIndex = this.filteredCampusAmbassadors.getValue().findIndex(el => {
            return !!(el.uid === uid);
        });
        if (filteredIndex !== -1) {
             this.filteredCampusAmbassadors.value[filteredIndex].points = points;
            // this.filteredCampusAmbassadors.next(newFilter);
        }
    }
  }
