import { LiveStreamModule } from './live-stream/live-stream.module';
import { FestAnalyticsModule } from './fest-analytics/fest-analytics.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NgModule } from '@angular/core';

import { LoginModule } from 'app/main/pages/authentication/login/login.module';
import { Error404Module } from 'app/main/pages/errors/404/error-404.module';
import { Error500Module } from 'app/main/pages/errors/500/error-500.module';
import {EventModule} from './event/event.module';
import { UsersModule } from './users/users.module';
import { PageService } from './pages.service';
import { MatSnackBarModule } from '@angular/material';
import { SelectionsModule } from './selections/selections.module';

@NgModule({
    imports: [
        // Authentication
        LoginModule,

       // Errors
        Error404Module,
        Error500Module,
        MatSnackBarModule,
        EventModule,
        SelectionsModule,
        UsersModule,
        AnalyticsModule,
        FestAnalyticsModule,
        LiveStreamModule
    ],
    declarations: [],
    providers: [PageService]
})
export class PagesModule
{

}
