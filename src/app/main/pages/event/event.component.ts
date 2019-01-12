import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {fuseAnimations} from '../../../../@fuse/animations';
import {ActivatedRoute} from '@angular/router';
import {EventEditService} from './event-edit.service';
import { PageService } from '../pages.service';
import { PackageMaterialClasses, PackageMaterialIcons } from '../users/user.model';
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
    posterURL;
    notificationBody;
    poster;
    eventId;
    uploading = false;
    packageClasses = PackageMaterialClasses;
    packageIcons = PackageMaterialIcons;
    eventForm = new FormGroup({
        'description': new FormControl('', [Validators.required, Validators.minLength(40), Validators.maxLength(400)]),
        'startsAt': new FormControl('', Validators.required),
        'endsAt': new FormControl('', Validators.required),
    });
  constructor(private route: ActivatedRoute, private eventEditService: EventEditService, private pageService: PageService) {
      this.route.params.subscribe(params => {
          this.eventId = params['id'];
          this.notificationBody = '';
        this.eventEditService.getEventDetail(this.eventId).then(res => {
             this.eventDetail = res;
             console.log(res);
             this.setEventForm(res);
             if (this.eventDetail.posterId) {
                this.eventEditService.getEventPoster(this.eventId, this.eventDetail.posterId).then(imageUrl => {
                    this.posterURL = imageUrl;
                });
                } else {
                    this.posterURL = null;
             }
             if (!this.eventDetail.children && !res.rounds) {
                this.eventDetail.rounds = [];
             }
             if (this.eventDetail.rounds) {
                 this.eventDetail.rounds.forEach(round => {
                    if (round.venue === undefined) {
                        round.venue = 'unknown';
                    }
                 });
                 this.timeStampToDate(this.eventDetail.rounds);
             }
             if (!this.eventDetail.links) {
                this.eventDetail.links = [];
             }
         });
      });
  }

  ngOnInit() {
  }

  setEventForm(eventDetail) {
        if (eventDetail.description === undefined) {
            eventDetail.description = ' ';
        }
      this.eventForm.controls['description'].setValue(eventDetail.description);
       this.eventForm.controls['startsAt'].setValue(new Date(eventDetail.startsAt));
      this.eventForm.controls['endsAt'].setValue(new Date(eventDetail.endsAt));

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
            venue: 'unknown',
            rules: [
                {
                    description: 'New rule'
                }
            ]
        });
  }
  updateRounds() {
      this.dateToTimeStamp(this.eventDetail.rounds);
      this.eventEditService.updateRounds(this.eventId, this.eventDetail.rounds).then(() => this.openSnackBar('Rounds updated'));;
      this.timeStampToDate(this.eventDetail.rounds);
  }

  addLink() {
      this.eventDetail.links.push({
        description: '',
        url: ''
      });
  }
  deleteLink(i) {
      this.eventDetail.links.splice(i, 1);
  }
  updateLinks() {
      this.eventEditService.updateLinks(this.eventId, this.eventDetail.links).then(() => {
        this.openSnackBar('Links updated');
      });
  }
  dateToTimeStamp(data) {
    data.forEach(item => {
        item.startsAt = new Date(item.startsAt).getTime();
        item.endsAt = new Date(item.endsAt).getTime();
    });
  }
  timeStampToDate(data) {
  data.forEach(item => {
        item.startsAt = new Date(item.startsAt);
        item.endsAt = new Date(item.endsAt);
    });
  }
  updateDescription() {
      if (!this.eventForm.valid) {
        this.openSnackBar('The description should be between 40 to 400 characters! Please ensure you have have selected valid date!');
            
        return ;
      }
      const data = Object.assign(this.eventForm.value);
      data.startsAt = new Date(data.startsAt).getTime();
      data.endsAt = new Date(data.endsAt).getTime();
      this.eventEditService.updateEventDescription(this.eventId, data).then(() => this.openSnackBar('Description updated!'));

  }
  sendNotification() {
    this.eventEditService.sendNotification(this.eventId, this.notificationBody).then(res => {
        this.openSnackBar('Notification sent');
    }).catch(e => {
        this.openSnackBar(e && e.message);
    });
  }
  previewImage(e) {
        this.imageFile = e.target.files[0];
        console.log(this.imageFile.size / 1024);
        console.log(this.imageFile);
        let errMsg = '';
        if (this.imageFile.type.slice(0, 5) !== 'image') {
            errMsg = 'File is not image';
        }
       
        if (this.imageFile.size / 1024 <= 100 || this.imageFile.size / (1024 * 1024) >= 10) {
            errMsg = 'Size should be between 100kB and 10MB';
        }
        if (errMsg !== '') {
            this.openSnackBar(errMsg);
            this.imageFile = null;
            return;
        }
        const url = URL.createObjectURL(e.target.files[0]);
        this.posterURL = url;
    }
    saveImage() {
        this.uploading = true;
        this.eventEditService.uploadPoster(this.imageFile, this.eventId).then(res => {
            this.uploading = false;
            this.openSnackBar('Poster updated');
        });
    }
    updatePortalTimings() {
        const startsAt = new Date(this.eventDetail.registrationDetail.startsAt).getTime();
        const endsAt = new Date(this.eventDetail.registrationDetail.endsAt).getTime();
        this.eventEditService.updatePortal(this.eventId, startsAt, endsAt)
        .then(() => {
            this.openSnackBar('Portal Timings updated');
        })
        .catch(e => {
            this.openSnackBar(e && e.message);
        });
    }
    openSnackBar(message) {
        return this.pageService.openSnackBar(message);
    }
}
