import { FormsModule } from '@angular/forms';
import { MatMenuModule, MatInputModule, MatTableModule, MatCheckboxModule, MatIconModule, MatPaginatorModule, MatButtonModule, MatSortModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {FuseSharedModule} from '../../../../@fuse/shared.module';
import {FuseWidgetModule} from '../../../../@fuse/components';
import { EventGuard } from '../event/event.guard';
import { SelectionsComponent } from './selections.component';
import { SelectionsService } from './selections.service';
const routes: Routes = [
    {
        path     : 'selections/:id',
        component: SelectionsComponent,
        canActivate: [EventGuard]
    }
];
@NgModule({
  imports: [
    CommonModule,
      RouterModule.forChild(routes),
      FuseSharedModule,
      FuseWidgetModule,
      MatTableModule,
      MatMenuModule,
      MatInputModule,
      MatCheckboxModule,
      MatPaginatorModule,
      MatButtonModule,
      MatIconModule,
      FormsModule,
      MatSortModule
  ],
  providers: [SelectionsService],
  declarations: [SelectionsComponent]
})
export class SelectionsModule { }
