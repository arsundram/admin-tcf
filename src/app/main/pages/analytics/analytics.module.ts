import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {MatButtonModule, MatChipsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatRippleModule, MatTabsModule,
     MatTooltipModule, MatSnackBarModule, MatTableModule, MatPaginatorModule, MatSortModule, MatCheckboxModule, MatMenuModule, MatSelectModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {FuseSharedModule} from '../../../../@fuse/shared.module';
import {FuseWidgetModule} from '../../../../@fuse/components';
import { EventGuard } from '../event/event.guard';
import { AnalyticsComponent } from './analytics.component';
import { AnalyticsService } from './analytics.service';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

const routes: Routes = [
    {
        path     : 'analytics/:id',
        component: AnalyticsComponent,
        canActivate: [EventGuard]
    }
];
@NgModule({
  imports: [
    CommonModule,
      RouterModule.forChild(routes),
      ChartsModule,
      NgxChartsModule,
      FuseSharedModule,
      FuseWidgetModule
  ],
  providers: [AnalyticsService],
  declarations: [AnalyticsComponent]
})
export class AnalyticsModule { }
