import { FuseSplashScreenService } from './../../../../@fuse/services/splash-screen.service';
import { PageService } from './../pages.service';
import { debounceTime } from 'rxjs/operators';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SelectionsService } from './selections.service';

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { User } from '../users/user.model';
import { MatSort, MatPaginator } from '@angular/material';
import { ExcelService } from '@fuse/services/excel.service';

@Component({
    selector   : 'app-selections',
    templateUrl: './selections.component.html',
    styleUrls  : ['./selections.component.scss'],
    animations : fuseAnimations
})
export class SelectionsComponent implements OnInit, OnDestroy
{
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator)
    paginator: MatPaginator;
    filteredSelections = new BehaviorSubject([]);
    filteredSelectionsPage = new BehaviorSubject([]);
    isAscending = false;
    pageSize = 25;
    pageIndex = 0;
    pagesLength = 1;
    loaded = false;
    selections:   Array<{
            user: User,
            registeredAt: Date
        } | {
            memberDetails: {
                name: any,
                uid: any,
            }[],
            captainDetails: {
                name: string,
                uid: string,
            },
            registeredAt: Date,
            id: string,
            name: string
        }> = [];
    allRoundSelections = [];
    winnerSelections = [];
        // uid -> date if solo, teamId -> date if team
    nextRoundSelections = {};
    soloColumns = ['Next_Round', 'name', 'tcfId', 'email', 'native', 'date'];
    teamColumns = ['Next_Round', 'name', 'teamId', 'captain', 'members', 'date'];
    round = null;
    type = null;
    eventInfo = null;
    searchInput = new BehaviorSubject('');
    searchSub: Subscription;
    sortTerm = 'Next_Round';
    constructor(
        private selectionService: SelectionsService,
        private route: ActivatedRoute,
        private pageService: PageService,
        private splashScreen: FuseSplashScreenService,
        private excelService: ExcelService
    )
    {
        
    }
  
 
    ngOnInit(): void
    {
        this.route.params.subscribe(res => {
            this.clear();
            this.splashScreen.show();
            this.setUpPage(res['id'])
            .catch(e => {
                this.pageService.openSnackBar('An error occurred');
                this.clear();
            })
            .then(() => {
                this.splashScreen.hide();
            });
            if (this.searchSub) {
                this.searchSub.unsubscribe();
            }
            this.searchSub = this.searchInput.pipe(debounceTime(200)).subscribe(search => {
                let selections = this.sortData(this.selections.slice());
                selections = this.searchData(search, selections);
                this.filteredSelections.next(selections);
                this.renderPage();
             });
        });
       
    }
    setUpPage(eventID, round?) {
       return this.selectionService.getEventInfo(eventID)
        .then((event) => {
            if (event) {
                this.eventInfo = event;
                if (!(round && this.eventInfo.rounds.length > round)) {
                    round = 0;
                }
                Promise.all(this.eventInfo.rounds.map((r, i) => {
                    return this.selectionService.findSelectionDetail(eventID, i);
                }))
                .then(allReg => {
                    this.allRoundSelections = allReg.map(el => el['registrations']);
                    this.type = event.registrationDetail.type;
                    this.changeRound(round);
                })
                .then(() => {
                    return this.selectionService.findSelectionDetail(eventID, 'winner');
                })
                .then((win) => {
                    this.winnerSelections = win.registrations;
                    this.loaded = true;
                    return null;
                });
            } else {
                throw new Error('no event found');
            }
        });
    }
    clear() {
        this.allRoundSelections = [];
        this.winnerSelections = [];
        this.filteredSelections.next([]);
        this.eventInfo = null;
        this.filteredSelectionsPage.next([]);
        this.nextRoundSelections = {};
        this.round = 0;
        this.pageSize = 25;
        this.pageIndex = 0;
        this.pagesLength = 1;
        this.searchInput.next('');
        this.loaded = false;
        this.sortTerm = 'Next_Round';
    }
    clearNextRoundSelections() {
        this.nextRoundSelections = {};
    }
    canShortList() {
        if (this.winnerSelections && this.winnerSelections.length !== 0) {
            return false;
        }
        const nextShortlist = this.allRoundSelections.slice().reverse().findIndex(el => {
            if (el && el.length !== 0) {
                return true;
            }
            return false;
        });
        if (nextShortlist === undefined) {
            return null;
        }
       if (this.round === (this.allRoundSelections.length - nextShortlist - 1)) {
           return true;
       }
    }
    changeRound(i) {
        this.selections = this.allRoundSelections[i];
        this.round = i;
        this.filteredSelections.next(this.selections);
        this.clearNextRoundSelections();
        this.paginate();
    }
    showWinners() {
        this.round = null;
        this.filteredSelections.next(this.winnerSelections);
        this.clearNextRoundSelections();
        this.paginate();
    }

    enterNextRound() {
        for (const key in this.nextRoundSelections) {
            if (this.nextRoundSelections[key] !== true) {
                delete this.nextRoundSelections[key];
            }
        }
        if (Object.keys(this.nextRoundSelections).length === 0) {
            this.pageService.openSnackBar('No selections made');
            return;
        }
        let data;
        if (this.type === 'team') {
             data = this.mapTeamKeys(Object.keys(this.nextRoundSelections));
        } else {
            const selections = (<Array<{
                user: User,
                registeredAt: Date
            }>>this.selections);
            data = Object.keys(this.nextRoundSelections).map(el => {
                const index = selections.findIndex(
                    userAndRegistrationTime =>
                     {
                    return userAndRegistrationTime.user.uid === el;
                    });
                    if (index === -1) {
                        throw new Error('Fatal error, please contact support team');
                    }
                return {[el]: selections[index].registeredAt.getTime()};
            });
        }
        const nextRound = this.isRoundFinal() ? 'winner' : this.round + 1;
        this.splashScreen.show();
            this.selectionService.bulkUpdateForRound(this.eventInfo.id, this.type, this.round, nextRound, data)
            .then(() => {
                return this.setUpPage(this.eventInfo.id, this.round);
            })
            .catch((e) => {
                this.pageService.openSnackBar(e && e.message);
            })
            .then(() => {
                this.splashScreen.hide();
                this.clearNextRoundSelections();
            });

    }
    mapTeamKeys(teamKeys) {
        return teamKeys.map(key => {
           return (<Array<
            {
                memberDetails: {
                    name: any;
                    uid: any;
                }[],
                captainDetails: {
                    name: string;
                    uid: string;
                };
                registeredAt: Date;
                id: string;
                name: string;
            }
            >>this.selections).find((team) => {
               return key === team.id;
            });
        }).filter(el => {
           return el !== undefined;
        }).map(el => {
           return {
                [el.id]: {
                    name: el.name,
                    registeredAt: el.registeredAt.getTime(),
                    members: el.memberDetails.map(e => e.uid),
                    captain: el.captainDetails.uid
                }
            };
        });
    }
    isRoundFinal() {
        const nextRound = this.eventInfo.rounds[this.round + 1] || null;
        return !nextRound;
    }
    
    toggleID(id) {
        if (this.nextRoundSelections[id]) {
            delete this.nextRoundSelections[id];
        } else {
            this.nextRoundSelections[id] = Date.now();
        }
    }
    sortInput(e) {
        debugger;
        console.log(e);
        if (e.direction === '') {
            return;
        }
        this.sortTerm = e.active;
        this.isAscending = !!(e.direction === 'asc');
        console.log(e.direction, this.isAscending);

        const selections = this.sortData(this.filteredSelections.getValue());
        this.filteredSelections.next(selections);
        this.renderPage();
    }
    paginate(e?) {
        console.log(this.filteredSelections.getValue());
        if (!e) {
                e = {
                    pageIndex: 0,
                    pageSize: this.filteredSelections.getValue().length
                    
                };
        }
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;
        this.renderPage();
    }

   renderPage() {
       const start = this.pageIndex * this.pageSize;
        const page = this.filteredSelections.getValue().
        slice(start, start + this.pageSize);
        this.filteredSelectionsPage.next(page);
        if (!(this.filteredSelections.getValue().length || page.length)) {
            this.pagesLength = 0;
        } else {
        this.pagesLength = Math.ceil(this.filteredSelections.getValue().length / (page.length));
        }
   }



    ngOnDestroy(): void
    {
        this.searchSub.unsubscribe();
    }
    sortData(selections) {
        if (this.type === 'team') {
            selections = this.sortTeams(this.sortTerm, selections);
        } else if (this.type === 'solo') {
            selections = this.sortSolo(this.sortTerm, selections);
        }
        if (!this.isAscending) {
            selections.reverse();
        }
        return selections;

    }
    searchData(term, selections?) {
        if (!selections) {
            selections = this.selections.slice();
        }
        if (!term || term === '') {
            return selections;
        }
        if (this.type === 'team') {
            return this.searchTeams(term, selections);
        }
        return this.searchSolo(term, selections);
    }
    searchTeams(term, selections) {
        return selections.filter(el => {
            return el.captainDetails.name.startsWith(term) ;
        }); 
    }

    searchSolo(term, selections) {
        return selections.filter(el => {
            return el.user.email.startsWith(term);
        });
    }

    sortTeams(active, selections) {
        switch (active) {
            case 'Next_Round':
            selections.sort((a, b) => {
                const aVal = this.nextRoundSelections[a.id] ? 1 : 0;
                const bVal = this.nextRoundSelections[b.id] ? 1 : 0;
                return aVal - bVal;
            });
            break;
            case 'name':
                selections.sort((a, b) => {
                    return this.localeCompare(a.name, b.name);
                });
            break;
            case 'teamId':
            selections.sort((a, b) => {
                return this.localeCompare(a.id, b.id);
            });
            break;
            case 'captain':
            selections.sort((a, b) => {
                return this.localeCompare(a.captainDetails.name, b.captainDetails.name);
            });
            break;
            case 'members':
            selections.sort((a, b) => {
                    const l1 = a.memberDetails && a.memberDetails.length || 0;
                    const l2 = b.memberDetails && b.memberDetails.length || 0;
                    return l1 - l2;
                });
            break;
            case 'date':
                selections.sort((a, b) => {
                    return this.dateCompare(a.registeredAt, b.registeredAt);
                });           
            }
        return selections;
    }

    sortSolo(active, selections) { 
        switch (active) {
            case 'Next_Round':
            selections.sort((a, b) => {
                const aVal = this.nextRoundSelections[a.user.tcfId] ? 1 : 0;
                const bVal = this.nextRoundSelections[b.user.tcfId] ? 1 : 0;
                return aVal - bVal;
            });
            break;
            case 'name':
            selections.sort((a, b) => {
                    return this.localeCompare(a.user.name, b.user.name);
                });
            break;
            case 'tcfId':
                selections.sort((a, b) => {
                    return this.localeCompare(a.user.tcfId, b.user.tcfId);
                });
            break;
            case 'email':
                selections.sort((a, b) => {
                    return this.localeCompare(a.user.email, b.user.email);
                });
            break;
            case 'native':
                selections.sort((a, b) => {
                    return a.user.isNative > b.user.isNative ? 1 : -1;
                });
            break;
            case 'date':
            selections.sort((a, b) => {
                return this.dateCompare(a.registeredAt, b.registeredAt);
            });
        }
        return selections;
    }
    localeCompare(a, b) {
        return a.localeCompare(b);
    }
    dateCompare(a, b) {
        return a.getTime() - b.getTime();
    }
    exportExcel() {
        if(this.round !== null) {
        if (this.type === 'team') {
            if (this.round !== 'winner') {
                this.excelService.exportAsExcelFile(
                    this.exportTeamExcel(this.selections),
                 `Round ${this.round + 1} ${this.eventInfo && this.eventInfo.name}`);
            } else if (this.round === 'winner') {
                this.excelService.exportAsExcelFile(
                    this.exportTeamExcel(this.selections),
                 `Winners ${this.eventInfo && this.eventInfo.name}`);
            }
        } else if (this.type === 'solo') {
            if (this.round !== 'winner') {
                this.excelService.exportAsExcelFile(
                    this.exportSoloExcel(this.selections),
                 `Round ${this.round + 1} ${this.eventInfo && this.eventInfo.name}`);
            } else {
                this.excelService.exportAsExcelFile(
                    this.exportSoloExcel(this.selections),
                 `Winners ${this.eventInfo && this.eventInfo.name}`);
            }
        }
    }
    }
    exportTeamExcel(selections) {
        return selections.map(selection => {
            const format =  (<{
                 memberDetails: {
                     name: any,
                     uid: any,
                 }[],
                 captainDetails: {
                     name: string,
                     uid: string,
                 },
                 registeredAt: Date,
                 id: string,
                 name: string
             }>selection);
             const formatReturn = {
                 'Registered At': format.registeredAt,
                 'Captain Name': format.captainDetails,
                 'Team ID': format.id,
                 'Team Name': format.name
             };
             format.memberDetails.forEach((member, i) => {
                 formatReturn['Member ' + i + ' Name'] = member.name; 
             });
             return formatReturn;
         });
    }
    exportSoloExcel(selections) {
       return selections.map(selection => {
        const format = (<{
            user: User,
            registeredAt: Date
        }>selection);
        return {
            'Registered At': format.registeredAt,
            'Name': format.user.name,
            'TCF ID': this.formatNull(format.user.tcfId),
            'Email': format.user.email,
            'Roll No.': format.user.rollNo,
            'College': format.user.collegeName,
            'Year of Completion': this.formatNull(format.user.yearOfCompletion),
            'Branch': this.formatNull(format.user.branch)
        };
       });

    }
    formatNull(stringVariable) {
        if (!stringVariable) {
            return '-';
        }
        return stringVariable;
    }

}


