import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {AngularFireDatabase} from '@angular/fire/database';
import {BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EventService {
    events: BehaviorSubject<any>;
    constructor(private auth: AuthService, private afDb: AngularFireDatabase) {
        this.events = new BehaviorSubject<any>(null);
        this.auth.user$.subscribe(user => {
           if (user) {
               this.auth.getUserDetail(user.uid).then(detail => {
                   this.getEventTree(detail.admin).then(res => {
                       this.events.next(res);
                   });
               });
           }
        });
    }
    getEventTree(eventID) {
        return this.findEventDataByID(eventID).then(res => {
             return this.getChildren(res);
         });
    }


    mapEventToNavigationItem(event) {

        if (event.children) {
            event.children = [{
                id: event.id, name: event.name + ' Settings'
            }, ...event.children];
                event.children = event.children.map(child => this.mapEventToNavigationItem(child));

            return {
                translate: 'NAV.APPLICATIONS',
                type: 'collapsable',
                icon: 'settings_applications',
                title: event.name,
                children: event.children
            };
        } else {

               return {
                    translate: 'NAV.APPLICATIONS',
                    type: 'item',
                    title: event.name,
                    icon: 'subdirectory_arrow_right',
                    url: 'pages/events/' + event.id,
                };
        }
    }

    findEventDataByID(id) {
        return this.afDb.database.ref('events/' + id).once('value').then(res => {
            return {id, ...res.val()};
        });
    }
    getChildren(event) {
        if (!(event && event.children))
        {
            return Promise.resolve(event);
        }
        const childrenPromises = event.children.map(child => {
            return this.findEventDataByID(child.id);
        });
        return Promise.all(childrenPromises).then((data: any) => {
            return Promise.all(data.map(ev => this.getChildren(ev))).then(res => {
                event.children = data;
                // console.log(event);
                return event;
            });
        });
    }
}
