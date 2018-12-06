import {ModuleWithProviders, NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { FuseDirectivesModule } from '@fuse/directives/directives';
import { FusePipesModule } from '@fuse/pipes/pipes.module';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {environment} from '../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/database';

@NgModule({
    imports  : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        FlexLayoutModule,

        FuseDirectivesModule,
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        AngularFireModule.initializeApp(environment.firebase),
        FusePipesModule
    ],
    exports  : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        FuseDirectivesModule,
        FusePipesModule,
        AngularFireModule,
        AngularFireAuthModule
    ]
})
export class FuseSharedModule
{
}
