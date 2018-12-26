import { NgModule } from '@angular/core';

import { LoginModule } from 'app/main/pages/authentication/login/login.module';
import { Error404Module } from 'app/main/pages/errors/404/error-404.module';
import { Error500Module } from 'app/main/pages/errors/500/error-500.module';
import {EventModule} from './event/event.module';
import { UsersModule } from './users/users.module';

@NgModule({
    imports: [
        // Authentication
        LoginModule,

       // Errors
        Error404Module,
        Error500Module,

        EventModule,
        UsersModule
    ],
    declarations: [],
})
export class PagesModule
{

}
