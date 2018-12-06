import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from './event.component';
import {RouterModule} from '@angular/router';
import {MatChipsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatTabsModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
      MatInputModule
  ],
  declarations: [EventComponent]
})
export class EventModule { }
