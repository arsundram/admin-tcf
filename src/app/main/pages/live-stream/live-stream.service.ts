import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from './../users/user.service';
import { AuthService } from '@fuse/services/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';

@Injectable()
export class LiveStreamService {

    constructor(private afDb: AngularFireDatabase, private auth: AuthService, private userService: UserService,
                private afAuth: AngularFireAuth) { }
    async updateLiveStreams(streams) {
        streams = streams.slice();
        const isAdmin = await this.userService.checkIfIsAdmin();
        if (!isAdmin) {
            throw new Error('Sorry, an error occurred');
        }
        const uid = this.auth.user$.value.uid;
        streams.forEach(el => {
            el.startsAt = this.convertDateToTimeStamp(el.startsAt);
            el.endsAt = this.convertDateToTimeStamp(el.endsAt);
        });
        return this.afDb.database.ref('live-streams/' + uid)
               .set(streams);
    }

   async getLiveStreams() {
        const isAdmin = await this.userService.checkIfIsAdmin();
        if (isAdmin) {
        const uid = this.auth.user$.value.uid;
        console.log(uid);
        return await this.afDb.database.ref('live-streams/' + uid).once('value')
        .then(res => res.val())
        .then(res => {
            if (!res) {
                res = [];
            }
            res.forEach(el => {
                el.startsAt = this.convertTimeStampToDate(el.startsAt);
                el.endsAt = this.convertTimeStampToDate(el.endsAt);
            });
            return res;
        });
        } else {
            throw new Error('Admin credential invalid');
        }
    }

    canActivate() {
        return this.userService.checkIfIsAdmin();
    }
    convertTimeStampToDate(time) {
        return new Date(time);
    }
    convertDateToTimeStamp(date) {
        return new Date(date).getTime();
    }

}
