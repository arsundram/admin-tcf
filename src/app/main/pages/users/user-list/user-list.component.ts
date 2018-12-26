import { Component, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
      encapsulation: ViewEncapsulation.None,
      animations   : fuseAnimations
  
  })
  export class UserListComponent {

  }
