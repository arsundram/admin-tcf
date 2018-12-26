import { Injectable } from '@angular/core';
import {EventService} from '../../../../@fuse/services/event.service';
import {AngularFireStorage} from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class EventEditService {

  constructor(private baseEventService: EventService,
     private afStorage: AngularFireStorage, private afDb: AngularFireDatabase, private afFunctions: AngularFireFunctions) { }
  getEventDetail(id) {
      return this.baseEventService.findEventDataByID(id);
  }
  updateEventDescription(eventId, data) {
    return this.afDb.database.ref('/events/' + eventId).update(data);

  }
  updateLinks(eventId, links) {
    return this.afDb.database.ref('/events/' + eventId + '/links').update(links);
  }
  updateRounds(eventId, rounds) {
        return this.afDb.database.ref('/events/' + eventId + '/rounds').update(rounds);
  }
  uploadPoster(file, id) {
      const randomId = Math.random().toString(36).substring(2);
      return this.afStorage.ref('posters/events/' + id + '/' + randomId).put(file).then(res => {
        return this.afDb.database.ref('/events/' + id + '/posterId').set(randomId);
      });
  }
  getEventPoster(eventId, id) {
      return this.afStorage.ref('posters/events/' + eventId + '/' + id).getDownloadURL().toPromise();
  }

  sendNotification(eventId, eventNotice) {
    return this.afFunctions.httpsCallable('functions-EventFunctions-eventNotice')({
        eventId, eventNotice
    }).toPromise();
  }
}
