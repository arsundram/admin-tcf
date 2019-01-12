import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';

@Injectable()
export class AnalyticsService {
    widgets = {
        widget1: {
            chartType: 'line',
            datasets : [ {
                
                        label: 'Registrations',
                        data : [],
                        fill : 'start'

            }],
            labels   : [],
            colors   : [
                {
                    borderColor              : '#42a5f5',
                    backgroundColor          : '#42a5f5',
                    pointBackgroundColor     : '#1e88e5',
                    pointHoverBackgroundColor: '#1e88e5',
                    pointBorderColor         : '#ffffff',
                    pointHoverBorderColor    : '#ffffff'
                }
            ],
            options  : {
                spanGaps           : false,
                legend             : {
                    display: false
                },
                maintainAspectRatio: false,
                layout             : {
                    padding: {
                        top  : 32,
                        left : 32,
                        right: 32
                    }
                },
                elements           : {
                    point: {
                        radius          : 4,
                        borderWidth     : 2,
                        hoverRadius     : 4,
                        hoverBorderWidth: 2
                    },
                    line : {
                        tension: 0
                    }
                },
                scales             : {
                    xAxes: [
                        {
                            gridLines: {
                                display       : false,
                                drawBorder    : false,
                                tickMarkLength: 18
                            },
                            ticks    : {
                                fontColor: '#ffffff'
                            }
                        }
                    ],
                    yAxes: [
                        {
                            display: false,
                           ticks: {
                               beginAtZero: true
                           }
                        }
                    ]
                },
                plugins            : {
                    filler      : {
                        propagate: false
                    }
                }
            }
        },
        widget2: {
            chartType : 'bar',
            datasets  : [
                {
                    label: 'Total in round',
                    data : []
                }
            ],
            labels    : [],
            colors    : [
                {
                    borderColor    : '#42a5f5',
                    backgroundColor: '#42a5f5'
                }
            ],
            options   : {
                spanGaps           : false,
                legend             : {
                    display: false
                },
                maintainAspectRatio: false,
                layout             : {
                    padding: {
                        top   : 24,
                        left  : 16,
                        right : 16,
                        bottom: 16
                    }
                },
                scales             : {
                    xAxes: [
                        {
                            display: true
                        }
                    ],
                    yAxes: [
                        {
                            display: true,
                            ticks: {
                                beginAtZero: true
                            }
                        }
                    ]
                }
            }
        },
        widget3: {
            datasets: [{
                label: 'Subscriptions',
                data: []
            }],
            labels: []
        },
        widget7: {
            scheme : {
                domain: ['#4867d2', '#5c84f1', '#89a9f4']
            },
            devices: [
                {
                    name  : 'Desktop',
                    value : 92.8,
                    change: -0.6
                },
                {
                    name  : 'Mobile',
                    value : 6.1,
                    change: 0.7
                },
                {
                    name  : 'Tablet',
                    value : 1.1,
                    change: 0.1
                }
            ]
        }
    };
    totalPeople = 0;
    nativePeople = 0;
    nativeTeamCaptains = 0;
    totalTeams = 0;
    eventName;
    eventType;
    min;max;
    constructor(private afDb: AngularFireDatabase) { }
    async getAnalytics(eventId) {
        const packageDetails = await this.afDb.database.ref('packages').once('value').then(this.success);
        const registrationDetail = await this.afDb.database.ref('events/' + eventId + '/registrationDetail').once('value').then(this.success);
        const eventName = await this.afDb.database.ref('events/' + eventId + '/name').once('value').then(this.success);
       const registrationMapping = await this.afDb.database.ref('registration-mapping/' + registrationDetail.type + '/' + eventId).once('value').then(this.success);
       if (!registrationMapping) {
           throw new Error('No registrations yet');
       }
        if (registrationDetail.type === 'solo') {
            const allUID = {};
            const roundsCount = {};
            Object.keys(registrationMapping).forEach((el) => {
                roundsCount[el] =  Object.keys(registrationMapping[el]).length;
                Object.keys(registrationMapping[el]).forEach(key => {
                    allUID[key] = {
                        registeredAt: registrationMapping[el][key],
                        round: registrationMapping[el]
                    };
                 });
            });
             const packageAndCollegeId = await Promise.all(Object.keys(allUID).map(uid => {
                  return this.afDb.database.ref('users/' + uid + '/packages').once('value').then(this.success)
                            .then(packages => {
                                return this.afDb.database.ref('users/' + uid + '/collegeId').once('value').then(this.success)
                                .then((collegeId) => {
                                    return {packages, collegeId , uid};
                                });
                            });
                        }));
            packageAndCollegeId.forEach(data => {
                allUID[data.uid].packages = data.packages;
                allUID[data.uid].collegeId = data.collegeId;
            });
            const totalUsers = Object.keys(allUID).length;
            let numberOfNative = 0;
            let allPackages = {};
            const days = {};
            Object.keys(allUID).forEach(uid => {
                const packs = allUID[uid].packages;
                if (packs && packs.length && packs.length !== 0) {
                packs.forEach( pack => {
                    if (!allPackages[pack]) {
                        allPackages[pack] = 1;
                    } else {
                        allPackages[pack]++;
                    }
                });
                } 
                if (allUID[uid].collegeId === 'nitp') {
                    numberOfNative++;
                }
                const day = new Date(allUID[uid].registeredAt).getDate();
                if (!days[day]) {
                    days[day] = 1;
                } else {
                    days[day]++;
                }
            });

            allPackages = await Promise.all(Object.keys(allPackages)
                .map(packageKey => {
                    return this.afDb.database.ref('packages/' + packageKey + '/name').once('value').then(this.success)
                            .then((val) => {
                                return {
                                    name: val,
                                    count: allPackages[packageKey],

                                };
                            });
                }));
            this.setSoloWidgets({totalUsers, numberOfNative, allPackages, days, roundsCount, eventName, eventType: registrationDetail.type});
        } else if (registrationDetail.type === 'team') {
            const allTeamIDs = {};
            const roundsCount = {};
            Object.keys(registrationMapping).forEach((el) => {
                roundsCount[el] =  Object.keys(registrationMapping[el]).length;
                Object.keys(registrationMapping[el]).forEach(key => {
                    allTeamIDs[key] = registrationMapping[el][key];
                 });
            });
            const teamCount = Object.keys(allTeamIDs).length;
            const teams = await Promise.all(Object.keys(allTeamIDs).map(async (teamID) =>  {
                const data = allTeamIDs[teamID];
                const captainData = { uid: data.captain, packages: null, collegeId: null };
                let membersData = [];
                const capRef = this.afDb.database.ref('users/' + data.captain + '/');
                captainData.packages = await capRef.child('/packages').once('value').then(this.success);
                captainData.collegeId = await capRef.child('/collegeId').once('value');
                    if (data.members && data.members.length > 0) {
                    membersData = await Promise.all(
                        data.members.map(member => {
                            const memberRef = this.afDb.database.ref('users/' + member);
                            const memberData = {
                                uid: member,
                                packages: null,
                                collegeId: null
                            };
                            return memberRef.child('pakcages').once('value').then(this.success)
                            .then((memberPackages) => {
                                memberData.packages = memberPackages;
                                return memberRef.child('collegeId').once('value').then(this.success);
                            })
                            .then((collegeId) => {
                                memberData.collegeId = collegeId;
                                return memberData;
                            });
                        })
                    );
                    }
                    return {membersData, captainData, teamID, data}; 
                }));
                let totalPeople = 0;
                let numberOfNative = 0;
                let numberOfNativeCaptains = 0;
                let allPackages = {};
                const days = {};
                teams.forEach(team => {
                    totalPeople++;
                    if (team.captainData.collegeId === 'nitp') {
                        numberOfNative++;
                        numberOfNativeCaptains++;
                    }
                    if (team.captainData.packages) {
                        team.captainData.packages.forEach(pack => {
                            if (!allPackages[pack]) {
                                allPackages[pack] = 1;
                            } else {
                                allPackages[pack]++;
                            }
                        });
                    }
                    team.membersData.forEach(member => {
                        totalPeople++;
                        if (member.collegeId === 'nitp') {
                            numberOfNative++;
                        }
                        if (member.packages) {
                            member.packages.forEach(pack => {
                                if (!allPackages[pack]) {
                                    allPackages[pack] = 1;
                                } else {
                                    allPackages[pack]++;
                                }
                            });
                        }
                    });
                   const day = new Date(team.data.registeredAt).getDate();
                   if (!days[day]) {
                       days[day] = 1;
                   } else {
                       days[day]++;
                   }
                });
                allPackages = await Promise.all(Object.keys(allPackages)
                .map(packageKey => {
                    return this.afDb.database.ref('packages/' + packageKey + '/name').once('value').then(this.success)
                            .then((val) => {
                                return {
                                    name: val,
                                    count: allPackages[packageKey],

                                };
                            });
                }));
                const analytics = {days, totalPeople, teamCount, numberOfNative, numberOfNativeCaptains, allPackages, eventName, roundsCount, eventType: registrationDetail.type, 
                    min: registrationDetail.min, max: registrationDetail.max };
                this.setTeamWidgets(analytics);
        } else {
            throw new Error('Not found');
        }
    }
    success(data) {
        return data.val();
    }
    setTeamWidgets(analytics) {
       this.resetWidgets();
        Object.keys(analytics.days).forEach(day => {
            this.widgets.widget1.labels.push(day + ' JAN');
            this.widgets.widget1.datasets[0].data.push(analytics.days[day]);
        });
        Object.keys(analytics.roundsCount).forEach(roundId => {
            if (roundId !== 'winner') {
                this.widgets.widget2.labels.push('Round ' + (parseInt(roundId, 10) + 1));
            } else {
                this.widgets.widget2.labels.push('Winners');
            }
            this.widgets.widget2.datasets[0].data.push(analytics.roundsCount[roundId]);
        });
        analytics.allPackages.forEach(pack => {
            if (pack.name.length > 15) {
                pack.name = pack.name.slice(0, 12).concat('...');
            }
            this.widgets.widget3.labels.push(pack.name);
            this.widgets.widget3.datasets[0].data.push(pack.count);
        });
        this.totalPeople = analytics.totalPeople;
        this.nativePeople = analytics.numberOfNative;
        this.nativeTeamCaptains = analytics.numberOfNativeCaptains;
        this.totalTeams = analytics.teamCount;
        this.eventName = analytics.eventName;
        this.eventType = analytics.eventType;
        this.min = analytics.min;
        this.max = analytics.max;

    }
    setSoloWidgets(analytics) {
        this.totalPeople = analytics.totalUsers;
        this.nativePeople = analytics.numberOfNative;
        this.nativeTeamCaptains = analytics.numberOfNativeCaptains;
        this.totalTeams = 0;
        this.eventName = analytics.eventName;
        this.eventType = analytics.eventType;
        this.min = 1;
        this.max = 1;  
        this.resetWidgets();
        Object.keys(analytics.days).forEach(day => {
            this.widgets.widget1.labels.push(day + ' JAN');
            this.widgets.widget1.datasets[0].data.push(analytics.days[day]);
        });
        Object.keys(analytics.roundsCount).forEach(roundId => {
            if (roundId !== 'winner') {
                this.widgets.widget2.labels.push('Round ' + (parseInt(roundId, 10) + 1));
            } else {
                this.widgets.widget2.labels.push('Winners');
            }
            this.widgets.widget2.datasets[0].data.push(analytics.roundsCount[roundId]);
        });
        Object.keys(analytics.allPackages).forEach(packKey => {
            if (analytics.allPackages[packKey].name.length > 15) {
                analytics.allPackages[packKey].name = analytics.allPackages[packKey].name.slice(0, 12).concat('...');
            }
            this.widgets.widget3.labels.push(analytics.allPackages[packKey].name);
            this.widgets.widget3.datasets[0].data.push(analytics.allPackages[packKey].count);
        });
    }

    resetWidgets() {
        this.widgets.widget1.datasets[0].data = [];
        this.widgets.widget1.labels = [];
        this.widgets.widget2.datasets[0].data = [];
        this.widgets.widget2.labels = [];
        this.widgets.widget3.labels = [];
        this.widgets.widget3.datasets[0].data = [];
    }
}

