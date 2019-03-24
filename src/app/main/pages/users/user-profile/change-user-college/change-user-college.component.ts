import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-change-user-college',
    templateUrl: 'change-user-college.component.html',
    styleUrls: ['change-user-college.component.scss']
})

export class CHangeUserCollegeComponent implements OnInit {
    @Input() collegeName;
    @Input() collegeId;
    @Output() changeCollegeEmit = new EventEmitter();
    newCollegeName;
    newCollegeId;
    constructor() { }

    ngOnInit() {
        this.newCollegeName = this.collegeName;
        this.newCollegeId = this.collegeId;
        console.log(this.newCollegeId);
     }
     checkCollegeName() {
        if (this.newCollegeId === 'nitp') {
            this.newCollegeName = 'National Institute of Technology, Patna';
        }
     }
    changeCollege() {
        this.changeCollegeEmit.emit({
            collegeName: this.newCollegeName,
            collegeId: this.newCollegeId
        });
    }
}
