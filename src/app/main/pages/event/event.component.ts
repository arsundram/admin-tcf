import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EventComponent implements OnInit {
    pageType = 'edit';
    formX = new FormControl('');
  constructor() { }

  ngOnInit() {
  }

}
