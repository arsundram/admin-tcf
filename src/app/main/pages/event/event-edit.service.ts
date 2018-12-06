import { Injectable } from '@angular/core';
import {EventService} from '../../../../@fuse/services/event.service';
import {AngularFireStorage} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class EventEditService {

  constructor(private baseEventService: EventService, private afStorage: AngularFireStorage) { }
  getEventDetail(id) {
      return this.baseEventService.findEventDataByID(id);
  }
  uploadPoster(file, id) {
      const randomId = Math.random().toString(36).substring(2);
      return this.afStorage.ref('posters/events/' + id + '/' + randomId).put(file);
  }
}
