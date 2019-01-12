import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { PageService } from '../../pages.service';
import { User, Package } from '../user.model';
import { EventService } from '@fuse/services/event.service';
import { AuthService } from '@fuse/services/auth.service';
@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
      encapsulation: ViewEncapsulation.None,
      animations   : fuseAnimations
  
  })
  export class UserProfileComponent implements OnInit {
    user: User | null ;
    packageList: Array<Package> | null = null;
    packageToAdd: string;
    userSoloRegistrationDetail: Array<{
        eventName: any,
        registeredAt: Date,
        eventId: any,
        round: any
    }> = null;
    userTeamRegistrationDetail: Array<{
        eventName: any,
        eventId: any,
        teamName: any,
        teamId: any,
        round: any,
        memberDetails: Array<{
            name: any,
            uid: any,
        }>,
        captainDetails: {
            name: any,
            uid: any
        },
        registeredAt: Date
        }> = null;
        uploading = false;
        eventTree = null;
        isSuperAdmin = null;
    userInvoiceList: Array<string> = null;
    constructor(private route: ActivatedRoute, 
        private userService: UserService,
         private splashScreen: FuseSplashScreenService,
         private pageService: PageService,
         private eventService: EventService,
         private auth: AuthService
         ) {

    }
    ngOnInit() {
        this.userService.getAllPackageList().then(res => {
            this.packageList = res;
        });
        this.searchOnInit();
        this.eventService.events.subscribe(res => {
            this.eventTree = res;
        });
        this.auth.user$.subscribe(user => {
            this.userService.checkIfIsAdmin('fest').then(res => {
                console.log(res);
                this.isSuperAdmin = res;
            });
        });
    }
     searchOnInit() {
        return this.route.queryParams.subscribe(res => {
            this.resetUser();
            if (res['uid']) {
                const uid = res['uid'];
                this.getUserFromUid(uid);
            } 
        });
    }
    searchEmail(email) {
        this.splashScreen.show();
        this.userService.getUserDetailFromEmail(email).then(res => {
            this.setUser(res);
        }).catch(e => {
            this.pageService.openSnackBar(e && e.message);
        }).then(() => this.splashScreen.hide());
    }

    resetUser() {
        this.user = null;
        this.packageToAdd = null;
        this.userSoloRegistrationDetail = null;
        this.userTeamRegistrationDetail = null;
        this.userInvoiceList = null;
        this.uploading = false;
    }
    refreshUser() {
        if (this.user && this.user.uid) {
            this.getUserFromUid(this.user.uid);
        }
    }
    getUserFromUid(uid) {
        this.splashScreen.show();
        return this.userService.getUserDetailFromUid(uid).then(detail => {
            return this.setUser(detail);
        }).catch(e => {
            this.pageService.openSnackBar(e && e.message);
        }).then(() => {
            this.splashScreen.hide();
        });
    }
    setUser(user) {
        this.user = user;
        return this.getUserSoloRegistratioDetails()
        .then(res => {
            this.userSoloRegistrationDetail = res;
            return this.getUserTeamRegistrationDetails();
        })
        .then((res) => {
            this.userTeamRegistrationDetail = res;
            return this.getUserInvoiceList();
        })
        .then((res) => {
            this.userInvoiceList = res;
        });
    }
    generateTcfId() {
        if (this.user && this.user.profileScore === 100 && this.user.packageCount) {
            this.splashScreen.show();
            return this.userService.generateTcfId(this.user).then(tcfId => {
                this.user.updateUser({tcfId});
            }).catch((e) => {
                this.pageService.openSnackBar(e && e.message);
            }).then(() => {
                this.refreshUser();
                this.splashScreen.hide();
            });
        } else {
            this.pageService.openSnackBar('Profile Score should be 100% and atleast 1 package should be added to user first');
        }
    }

    getUserPackages() {
        if (!(this.packageList && (this.user && this.user.packages))) { return []; }
        return this.packageList.filter(festPack => {
            return this.user.packages.indexOf(festPack.id) !== -1;
        });
  }
  getPackagesToAdd() {
    if (!(this.packageList && this.user)){ return []; }
    return this.packageList.filter(festPack => {
        return this.user.packages.indexOf(festPack.id) === -1;
    });
  }
  getUserSoloRegistratioDetails() {
    return Promise.all(this.user.registrations.solo.map(event => {
        return this.eventService.findEventNameAndSoloDetailForUser(event.eventId, event.round, this.user.uid);
    }));
  }
  getUserTeamRegistrationDetails() {
      return Promise.all(this.user.registrations.team.map(teamDetail => {
        return this.eventService.findEventNameAndTeamDetail(teamDetail.eventId, teamDetail.teamId, teamDetail.round, this.user.uid);
      }));
  }
  addPackageToUser() {
      const packageId = this.packageToAdd;
      if (this.user && packageId !== null) {
          this.splashScreen.show();
        return this.userService.
        addPackageToUser(this.user.uid, packageId)
        .then(() => {
            this.pageService.openSnackBar('Added Package of ' + packageId);
            this.user.packages.push(packageId);
            this.packageToAdd = null;
        })
        .catch((e) => {
            this.pageService.openSnackBar(e && e.message);
        })
        .then(() => {
            this.refreshUser();
            this.splashScreen.hide();
        });
      }
  }
  getUserInvoiceList() {
     return this.userService.getUserInvoiceListUrls(this.user);
  }
  uploadInvoice(event) {
      const file = event.target.files[0];
      console.log(file);
      if (!(this.user && this.user.uid)) {
          return this.pageService.openSnackBar('Oops, no user logged in');
      }
      if (file && file.size > 10 * 1024 * 1024) {
        return this.pageService.openSnackBar('Oops, file size is larger than 10MB or it is curropted');      
      }
      this.uploading = true;
      return this.userService.uploadInvoiceToUser(this.user, file)
        .then(res => {
            this.user.invoices.push(res.id);
            this.userInvoiceList.push(res.url);
            this.pageService.openSnackBar('Invoice uploaded');
            this.uploading = false;
        })
        .catch(e => {
            this.uploading = false;
            this.pageService.openSnackBar(e && e.message);
        });
  }

  findEventIdInTree(eventId) {
      return this.eventService.findInsideEventTree(this.eventTree, eventId);
  }

}
