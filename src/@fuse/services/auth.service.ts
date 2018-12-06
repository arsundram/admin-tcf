import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database';
import {BehaviorSubject} from 'rxjs';
import {User} from 'firebase';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public user$: BehaviorSubject<User | null>;
    constructor(private afAuth: AngularFireAuth, private afDb: AngularFireDatabase) {
        this.user$ = new BehaviorSubject(null);
        this.afAuth.authState.subscribe(res => {
           this.user$.next(res);
        });
    }
    async login(data) {
        try {
            const userDetail = await this.afAuth.auth.signInWithEmailAndPassword(data.email, data.password);
            const eventID = (await this.afDb.database.ref('users/' + userDetail.user.uid + '/admin').once('value')).val();
            if (!eventID) {
                await this.afAuth.auth.signOut();
                throw new Error('Sorry, you\'re not an admin');
            }
            const eventDetail = (await this.afDb.database.ref('events/' + eventID).once('value')).val();
            if (!eventDetail) {
                await this.afAuth.auth.signOut();
                throw new Error('Sorry, we could not find your event');
            }

        } catch (e) {
            console.log(e);
            throw new Error(e.message);
        }
    }
    logout() {
        return this.afAuth.auth.signOut();
    }
    getUserDetail(uid) {
        return this.afDb.database.ref('users/' + uid).once('value').then(res => res.val());
    }
}
