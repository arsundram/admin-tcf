import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatButtonModule, MatIconModule } from '@angular/material';

import { FuseSearchBarComponent } from './search-bar.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        FuseSearchBarComponent
    ],
    imports     : [
        CommonModule,
        RouterModule,
        FormsModule,
        MatButtonModule,
        MatIconModule
    ],
    exports     : [
        FuseSearchBarComponent
    ]
})
export class FuseSearchBarModule
{
}
