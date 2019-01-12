import { EventService } from './../../../../@fuse/services/event.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SelectionsService 
{
    orders: any[];
    onOrdersChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private eventService: EventService    )
    {
        // Set the defaults
        this.onOrdersChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    async findSelectionDetail(id, round) {
        const registrationDetail = await this.eventService.findAllRegistrationDataForEventRound(id, round);
        console.log(registrationDetail);
        return registrationDetail;
    }
     getEventInfo(id) {
        return this.eventService.findEventDataByID(id);
    }
    bulkUpdateForRound(eventID, type, prevRound, nextRound, data) {
        return Promise.all(data.map(el => {
            return this.eventService.updateRegistration( eventID, type, prevRound, nextRound, el);
        }));
    }
   
}
