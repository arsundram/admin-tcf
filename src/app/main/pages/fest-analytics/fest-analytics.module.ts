import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FestAnalyticsService } from './fest-analytics.service';
import { CampusAmbassadorGuard } from './../users/campus-ambassador/campus-ambassador.guard';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {FuseSharedModule} from '../../../../@fuse/shared.module';
import {FuseWidgetModule} from '../../../../@fuse/components';
import { FestAnalyticsComponent } from './fest-analytics.component';
import { ChartsModule } from 'ng2-charts';
import { MatTableModule, MatCardModule, MatSnackBarModule } from '@angular/material';

const routes: Routes = [
    {
        path     : 'fest-analytics',
        component: FestAnalyticsComponent,
        canActivate: [CampusAmbassadorGuard]
    }
];
@NgModule({
  imports: [
    CommonModule,
      RouterModule.forChild(routes),
      FuseSharedModule,
      FuseWidgetModule,
      ChartsModule,
      NgxChartsModule,
      MatTableModule,
      FuseSharedModule,
      FuseWidgetModule,
      MatSnackBarModule,
      MatCardModule
  ],
  providers: [FestAnalyticsService],
  declarations: [FestAnalyticsComponent]
})
export class FestAnalyticsModule { }
