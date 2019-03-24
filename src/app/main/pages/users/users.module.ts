import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatButtonModule, MatChipsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatRippleModule, MatTabsModule,
     MatTooltipModule, MatSnackBarModule, MatSelectModule, MatTableModule, MatPaginatorModule, MatSortModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AgmCoreModule} from '@agm/core';
import {FuseSharedModule} from '../../../../@fuse/shared.module';
import {FuseWidgetModule, FuseSearchBarModule} from '../../../../@fuse/components';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProfileGuard } from './user-profile/user-profile.guard';
import { CampusAmbassadorGuard } from './campus-ambassador/campus-ambassador.guard';
import { CampusAmbassadorComponent } from './campus-ambassador/campus-ambassador.component';
import { CHangeUserCollegeComponent } from './user-profile/change-user-college/change-user-college.component';
const routes = [
    {
        path     : 'users/campus-ambassador-program',
        component: CampusAmbassadorComponent,
        canActivate: [CampusAmbassadorGuard]
    },
    {
        path: 'users/profile',
        component: UserProfileComponent,
        canActivate: [UserProfileGuard]
    }
];
@NgModule({
  imports: [
    CommonModule,
      RouterModule.forChild(routes),
      FuseSearchBarModule,
      MatIconModule,
      MatTabsModule,
      MatChipsModule,
      MatFormFieldModule,
      FormsModule,
      ReactiveFormsModule,
      MatInputModule,
      MatButtonModule,
      MatRippleModule,
      MatTooltipModule,
      MatSnackBarModule,
      MatSelectModule,
      AgmCoreModule.forRoot({
          apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
      }),
      OwlDateTimeModule,
      OwlNativeDateTimeModule,
      FuseSharedModule,
      FuseWidgetModule,
      MatTableModule,
      MatPaginatorModule,
      MatSortModule,
      ],
  declarations: [ UserProfileComponent, CampusAmbassadorComponent, CHangeUserCollegeComponent]
})
export class UsersModule { }
