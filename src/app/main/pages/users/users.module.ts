import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatButtonModule, MatChipsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatRippleModule, MatTabsModule,
     MatTooltipModule, MatSnackBarModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AgmCoreModule} from '@agm/core';
import {FuseSharedModule} from '../../../../@fuse/shared.module';
import {FuseWidgetModule} from '../../../../@fuse/components';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import { UserListComponent } from './user-list/user-list.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserListGuard } from './user-list/user-list.guard';
import { UserProfileGuard } from './user-profile/user-profile.guard';
const routes = [
    {
        path     : 'users/list',
        component: UserListComponent,
        canActivate: [UserListGuard]
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
      AgmCoreModule.forRoot({
          apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
      }),
      OwlDateTimeModule,
      OwlNativeDateTimeModule,
      FuseSharedModule,
      FuseWidgetModule
  ],
  declarations: [ UserProfileComponent, UserListComponent]
})
export class UsersModule { }
