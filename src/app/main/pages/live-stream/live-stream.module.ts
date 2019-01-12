import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LiveStreamComponent } from './live-stream.component';
import { FuseWidgetModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LiveStreamService } from './live-stream.service';
import { NgModule } from '@angular/core';
import { MatIconModule, MatInputModule, MatButtonModule, MatChipsModule, MatFormFieldModule, MatRippleModule, MatTooltipModule, MatSnackBarModule } from '@angular/material';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { OwlDialogModule } from 'ng-pick-datetime/dialog';
import { AgmCoreModule } from '@agm/core';


const routes: Routes = [
    {
        path     : 'live-stream',
        component: LiveStreamComponent,
        canActivate: [LiveStreamService]
    }
];
@NgModule({
  imports: [
    CommonModule,
    FuseWidgetModule,
      RouterModule.forChild(routes),
      FuseSharedModule,
     MatIconModule,
     MatButtonModule,
     OwlDialogModule,
     FormsModule,
     ReactiveFormsModule,
     MatFormFieldModule,
     MatInputModule,
     MatButtonModule,
     OwlDateTimeModule,
     OwlNativeDateTimeModule,
  ],
  providers: [LiveStreamService],
  declarations: [LiveStreamComponent]
})
export class LiveStreamModule { }
