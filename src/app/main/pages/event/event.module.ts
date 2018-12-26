import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from './event.component';
import {RouterModule} from '@angular/router';
import {MatButtonModule, MatChipsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatRippleModule, MatTabsModule,
     MatTooltipModule, MatSnackBarModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AgmCoreModule} from '@agm/core';
import {FuseSharedModule} from '../../../../@fuse/shared.module';
import {FuseWidgetModule} from '../../../../@fuse/components';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import { EventGuard } from './event.guard';
const routes = [
    {
        path     : 'events/:id',
        component: EventComponent,
        canActivate: [EventGuard]
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
  declarations: [EventComponent]
})
export class EventModule { }
