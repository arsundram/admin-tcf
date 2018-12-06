import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {fuseAnimations} from '../../../../@fuse/animations';
import {ActivatedRoute} from '@angular/router';
import {EventEditService} from './event-edit.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations

})
export class EventComponent implements OnInit {
    pageType = 'edit';
    eventDetail;
    imageFile;
    posterURL = 'https://firebasestorage.googleapis.com/v0/b/sac-nit-patna-69299.appspot.com/o/byte-o.jpg?alt=media&token=ab1791ab-f0ee-42bf-a095-d812782313b3';
    notificationBody;
    poster;
    eventForm = new FormGroup({
        'description': new FormControl('', [Validators.required, Validators.minLength(40), Validators.maxLength(400)]),
        'startsAt': new FormControl('', Validators.required),
        'endsAt': new FormControl('', Validators.required),
    })
  constructor(private route: ActivatedRoute, private eventEditService: EventEditService) {
      this.route.params.subscribe(params => {
         this.eventEditService.getEventDetail(params['id']).then(res => {
             this.eventDetail = res;
             console.log(res);
             this.setEventForm(res);
         });
      });
  }

  ngOnInit() {
        this.eventForm.valueChanges.subscribe(res => {
           console.log(res);
        });
  }

  setEventForm(eventDetail) {
        if (eventDetail.description === undefined) {
            eventDetail.description = ' ';
        }
      this.eventForm.controls['description'].setValue(eventDetail.description);
       this.eventForm.controls['startsAt'].setValue(new Date(eventDetail.startsAt));
      this.eventForm.controls['endsAt'].setValue(new Date(eventDetail.startsAt));

      console.log(this.eventForm.value);
  }

  deleteRound(event, i) {
         event.rounds.splice(i, 1);
  }

  deleteRule(round, i) {
       round.rules.splice(i, 1);
  }

  addNewRule(round) {
        if (!round.rules) {
            round.rules = [];
        }
        round.rules.push({
            description: 'New rule'
        });
  }
  addNewRound(event) {
         if (!event.rounds) {
            event.rounds = [];
        }
        event.rounds.push({
            description: 'New Round',
            startsAt: Date.now(),
            endsAt: Date.now(),
            rules: [
                {
                    description: 'New rule'
                }
            ]
        });
  }
  updateDescription() {
    console.log(this.eventDetail);
  }
  sendNotification() {

  }
  previewImage(e) {
        this.imageFile = e.target.files[0];
        const url = URL.createObjectURL(e.target.files[0]);
        this.posterURL = url;
    }
    uploadImage() {

    }

}
