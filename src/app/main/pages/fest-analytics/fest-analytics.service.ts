import { AngularFireFunctions } from '@angular/fire/functions';
import { Injectable } from '@angular/core';

@Injectable()
export class FestAnalyticsService {

    constructor(private afFunctions: AngularFireFunctions) { }
    getAnalytics() {
       return this.afFunctions.functions.httpsCallable('functions-AdminFunctions-getFestAnalytics')({}).then(res => res.data);
    }
}
