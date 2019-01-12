import { UserService } from './../../app/main/pages/users/user.service';
import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {AngularFireDatabase} from '@angular/fire/database';
import {BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EventService {
    events: BehaviorSubject<any>;
    constructor(private auth: AuthService, private afDb: AngularFireDatabase, private userService: UserService) {
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
        let children = null;
        if (event.children) {
            children = [{
                url: '/pages/events/' + event.id, name:  'Settings'
            }, ...event.children];
        } else if (!event.children && event.name !== 'Settings' && event.name !== 'Selections' && event.name !== 'Analytics'){
            children = [{
                url: '/pages/events/' + event.id, name: 'Settings'
            }, {
                url: '/pages/selections/' + event.id,
                 name: 'Selections'
            }, {
                url: '/pages/analytics/' + event.id,
                 name: 'Analytics'
            }
        ];
        }
        if (children) {
                children = children.map(child => this.mapEventToNavigationItem(child));
            return {
                translate: 'NAV.APPLICATIONS',
                type: 'collapsable',
                icon: 'subdirectory_arrow_right',
                title: event.name,
                children: children,
            };
        } else {
                if (event.name === 'Settings') {
               return {
                    translate: 'NAV.APPLICATIONS',
                    type: 'item',
                    title: event.name,
                    icon: 'settings',
                    url: event.url,
                };
            } else if (event.name === 'Selections') {
                return {
                    translate: 'NAV.APPLICATIONS',
                    type: 'item',
                    title: event.name,
                    icon: 'add_circle_outline',
                    url: event.url,
                };
            } else if (event.name === 'Analytics') {
                return {
                    translate: 'NAV.APPLICATIONS',
                    type: 'item',
                    title: event.name,
                    icon: 'assessment',
                    url: event.url,
                };
            }
        }
    }

    findEventDataByID(id) {
        return this.afDb.database.ref('events/' + id).once('value').then(res => {
            return {id, ...res.val()};
        });
    }
    async findEventNameAndSoloDetailForUser(id, round, uid) {
        const ref = this.afDb.database.ref('events/' + id);
        const eventType = (await ref.child('registrationDetail/type').once('value')).val();
        if (eventType !== 'solo') {
            throw new Error('Event type is not solo');
        }
        const eventName = (await ref.child('name').once('value')).val();
        const registeredAt = (await this.afDb.database.ref('registration-mapping/solo/' + id + '/' + round + '/' + uid).once('value')).val();
        if (!registeredAt) {
            throw new Error('User is not registered for this event');
        }
        return { eventName, registeredAt: new Date(registeredAt), eventId: id, round};
    }
    async findEventNameAndTeamDetail(eventId, teamId, round, uid?) {
        let eventName, eventType;
       
        const eventDetail = this.findInsideEventTree(this.events.value, eventId);
        if (eventDetail && eventDetail.name && eventDetail.registrationDetail.type) {
            eventName = eventDetail.name;
            eventType = eventDetail.registrationDetail.type;
        } else {
            const ref = this.afDb.database.ref('events/' + eventId);
             eventType = (await ref.child('registrationDetail/type').once('value')).val();

             eventName = (await ref.child('name').once('value')).val();
        }
        if (eventType !== 'team') {
            throw new Error('Event type is not team');
        }
        const teamDetail = <{
            members: Array<any>,
            captain: string,
            name: string,
            registeredAt: Date
        }>(await this.afDb.database.ref('registration-mapping/team/' + eventId + '/' + round + '/' + teamId).once('value')).val();
        if (!(uid && teamDetail && (teamDetail.captain === uid || (teamDetail.members && teamDetail.members.indexOf(uid) !== -1)))) {
            throw new Error('Error fetching team registration detail, please check');
        }
        const mappedTeamDetail =  await this.mapTeamRegistrationDetailToMembers(teamDetail);
        return {
            round,
            eventName,
            eventId,
            teamName: teamDetail.name,
            teamId,
            ...mappedTeamDetail,
            registeredAt: new Date(teamDetail.registeredAt)
        };
    }

    async mapTeamRegistrationDetailToMembers(teamDetail: {
        members: Array<any>,
        captain: string,
        name: string,
        registeredAt: Date
            }) {
        let memberDetails: Array<{name: any, uid: any}> = [];
        if (teamDetail.members) {
             memberDetails = await Promise.all(teamDetail.members.map(member => {
                return this.afDb.database.ref('users/' + member + '/name').once('value').then(res => {
                    return  {name: res.val(), uid: member};
                });
            }));
        }
        
        const captainDetails = await this.afDb.database.ref('users/' + teamDetail.captain + '/name')
                                .once('value').then(res => {
                                    return {name: res.val(), uid: teamDetail.captain};
                                });
        return { memberDetails, captainDetails};

    }
    async findAllRegistrationDataForEventRound(id, round) {
        let eventData = null;
        if (this.events.value) {
            console.log(this.events.value);
            eventData = this.findInsideEventTree(this.events.value, id);
        }else {
            eventData = await this.findEventDataByID(id);
        }
        if (!(eventData && eventData.registrationDetail && eventData.registrationDetail.type)) {
            throw new Error('Error loading page');
        }
        const type = eventData.registrationDetail.type;
        if (type !== 'solo' && type !== 'team') {
            throw new Error('Error loading event type');
        }
        return await type === 'solo' ? 
        { registrations: await this.getSoloRoundDetails(id, round), type: 'solo' } : 
        { registrations: await this.getTeamRoundDetails(id, round), type: 'team' };
    }

    async getSoloRoundDetails(id, round) {
       const registrations = (await this.afDb.database.ref('registration-mapping/solo/' + id + '/' + round).once('value')).val();
       if (!registrations) { return []; }
       const userIdList = Object.keys(registrations);
       const userDetails = await Promise.all(userIdList.map(uid => {
        return this.userService.getUserDetailFromUid(uid);
       }));
       return userIdList.map((uid, i) => {
        return {
            user: userDetails[i],
            registeredAt: new Date(registrations[uid])
        };
       });
    }

    async getTeamRoundDetails(eventId, round) {
        const registrations = (await this.afDb.database.ref('registration-mapping/team/' + eventId + '/' + round).once('value')).val();
        if (!registrations) { return []; }
        const teamIds = Object.keys(registrations);
        const teamDetails: Array<{
            registeredAt: Date,
            id: string,
            name: string
            }>  =  teamIds.map(id => {
                return {
                    id,
                    name: registrations[id].name,
                    registeredAt: new Date(registrations[id].registeredAt)
                };
            });
        const registrationTeamDetailArray = await Promise.all(Object.keys(registrations).map(teamId => {
            return this.mapTeamRegistrationDetailToMembers(registrations[teamId]);
        }));
        return Object.keys(registrations).map((teamId, i) => {
            return { ...teamDetails[i], ...registrationTeamDetailArray[i]};
        });
    }
    updateRegistration(eventID, type, prevRound, nextRound, data) {
        const key = Object.keys(data)[0];
        return this.afDb.database.ref('registration-mapping/' + type + '/' + eventID + '/' + prevRound + '/' + key).set(null)
        .then(() => {
             return this.afDb.database.ref('registration-mapping/' + type + '/' + eventID + '/' + nextRound + '/').update(data);
        }).
        then(() => {
            if (type === 'solo') {
                return this.afDb.database.ref('users/' + key + '/registrations/' + type + '/' + eventID).set(nextRound);
            } else {
                const captain = data[key].captain;
                const members = data[key].members;
                return this.afDb.database.ref('users/' + captain + '/registrations/' + type + '/' + eventID + '/' +  key).set(nextRound)
                        .then(() => {
                            return Promise.all(members.map(member => {
                                return this.afDb.database.ref('users/' + member + '/registrations/' + type + '/' + eventID + '/' +  key).set(nextRound);
                            }));
                        });
            }
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
                return event;
            });
        });
    }
    findInsideEventTree(parent, eventId) {
        if (parent && parent.id && (parent.id === eventId)) {
            return parent;
        }
       let check = false;
        if (parent && parent.children) {
            for (const index in parent.children) {
                if (parent.children[index]) {
                     check = this.findInsideEventTree(parent.children[index], eventId);
                     if (check) {
                         break;
                     }
                }
            }
           
        }
        return check;
    }
}
