import { Injectable } from '@angular/core';
import { AuthService } from '@fuse/services/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireFunctions } from '@angular/fire/functions';
import { User, Package } from './user.model';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({providedIn: 'root'})
export class UserService {
    constructor(private auth: AuthService,
         private afAuth: AngularFireAuth, 
         private afDb: AngularFireDatabase,
         private afFn: AngularFireFunctions,
         private afStorage: AngularFireStorage,
         private router: Router) { }


        getUserDetailFromEmail(email) {
            return this.afFn.functions.httpsCallable('functions-AdminFunctions-getUserByEmail')({email})
                    .then(res => {
                        return this.getUserDetailFromUid(res.data.uid);
                    });
        }
        getCampusAmbassadorList() {
            return this.afFn.functions.httpsCallable('functions-AmbassadorFunctions-getCampusAmbassadorList')({})
                .then(res => res.data);
        }
        changeAmbassadorPoints(uid, shouldIncrease) {
            return this.afDb.database.ref('users/' + uid + '/ambassador/points').transaction((points) => {
                if (!points) {
                    points = 0;
                }
                points = shouldIncrease ? points + 10 : points - 10;
                return points;
            }).then(res => res.snapshot.val());
        }
        getUserDetailFromUid(uid) {
            return this.afDb.database.ref('users/' + uid).once('value').then(this.success).then(data => {
                if (data) {
                    return new User({uid, ...data});
                } else 
                {
                    throw new Error('User Not Found');
                }
            });
        }
         checkIfIsAdmin(accessLevel?) {
            if (this.auth.user$.value && this.auth.user$.value.uid) {
                return this.auth.getUserDetail(this.auth.user$.value.uid).then(res => {
                    return Promise.resolve(!!(res && res.admin) && (!accessLevel || (res.admin === accessLevel)));
                });
              } else {
                  return new Promise((resolve, reject) => {
                    const sub = this.afAuth.authState.subscribe(user => {
                    if (user && user.uid) {
                        this.auth.getUserDetail(user.uid).then(res => {
                        resolve(!!((res && res.admin) && 
                        ((accessLevel && (res.admin === accessLevel)) || !accessLevel)));
                        }).catch(() => { 
                        resolve(false);
                        });
                    } else {
                        resolve(false);
                    }
                    sub.unsubscribe();
                }, e => resolve(false));
                  });
              }
         }
         generateTcfId(user: User) {
             if (!user.uid || (user.collegeId !== 'nitp' && user.collegeId !== 'other')) {
                 return Promise.reject('Invalid parameters');
             }
             return this.afDb.database.ref('users/' + user.uid)
              .ref.once('value').then(res => {
                 if (res.val()) {
                    if (res.val().tcfId) {
                        throw new Error('TCF ID ALREADY EXISTS ON USER');
                    }
                    if (!(res.val().packages && res.val().packages.length)) {
                        throw new Error('USER DOES NOT HAVE ANY PACKAGES');
                    }
                 }
             }).then(() => {
                 const uniqueTcfIdsubstring = Math.random().toString(36).substring(7, 11).toUpperCase() 
                                            + Math.random().toString(36).substring(7, 11).toUpperCase();
                const tcfId = 'TCF' + (user.isNative ? 'NITP' : 'OC') + uniqueTcfIdsubstring;
                return tcfId;
             }).then((tcfId) => {
                 const ref = this.afDb.database.ref('tcf-id-mapping/' + user.collegeId + '/' + tcfId);
                return ref
                 .once('value').then(res => {
                    if (res.exists()) {
                        throw new Error('FATAL!!THE TCF ID IS TAKEN BY ANOTHER USER');
                    }
                }).then(() => {
                    return ref.set(user.uid).then(() => tcfId).then(() => tcfId);
                });
            }).then(tcfId => {
                return this.afDb.database.ref('users/' + user.uid + '/tcfId').set(tcfId).then(() => tcfId);
             });
         }
         addPackageToUser(uid, packageId) {
             if (uid === null || packageId === null) {
                 return Promise.reject('Make sure a user and package is selected');
             }
             return this.afDb.database.ref('users/' + uid + '/packages/')
                .transaction((res) => {
                    if (res && res.indexOf(packageId) !== -1) {
                        return res;
                    }
                    if (!res) { res = []; }
                    res.push(packageId);
                    return res;
                }, (e => {
                    console.log(e);
                    return e;
                }));
         }
         getUserInvoiceListUrls(user: User) {
            return Promise.all(user.invoices.map(invoiceId => {
                return this.afStorage.ref('invoices/users/' + user.uid + '/' + invoiceId)
                .getDownloadURL().toPromise();
            }));
         }
         uploadInvoiceToUser(user: User, file) {
            const randomId = Math.random().toString(36).substring(2);
            return this.afStorage.ref('invoices/users/' + user.uid + '/' + randomId).put(file)
                    .then(res => {
                        return res.ref.getDownloadURL();
                    })
                    .then(url => {
                        return this.afDb.database.ref('/users/' + user.uid + '/invoices')
                        .transaction(invoiceList => {
                            if (!invoiceList) {
                                invoiceList = [];
                            }
                            invoiceList.push(randomId);
                            return invoiceList;
                        }, e => console.log(e)).then(() => {
                            return   {id: randomId, url};
                        });
                    });
         }
         getAllPackageList() {
             return this.afDb.database.ref('packages').once('value').then(this.success)
                    .then(list => {
                        return Object.keys(list).map(id => {
                            return new Package({id, ...list[id]});
                        });
                    });
         }
         changeUserCollge(uid, collegeName, collegeId) {
             return this.afDb.database.ref('users/' + uid).update({
                collegeName, collegeId
             });
         }

          success(res) {
              return res.val();
          }
}
