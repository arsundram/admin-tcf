import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from './event.component';
import {RouterModule} from '@angular/router';
import {MatButtonModule, MatChipsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatRippleModule, MatTabsModule, MatTooltipModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AgmCoreModule} from '@agm/core';
import {FuseSharedModule} from '../../../../@fuse/shared.module';
import {FuseWidgetModule} from '../../../../@fuse/components';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
const routes = [
    {
        path     : 'events/:id',
        component: EventComponent
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
