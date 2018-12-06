import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from './event.component';
import {RouterModule} from '@angular/router';
const routes = [
    {
        path     : 'events/:id',
        component: EventComponent
    }
];
@NgModule({
  imports: [
    CommonModule,
      RouterModule.forChild(routes)
  ],
  declarations: [EventComponent]
})
export class EventModule { }
