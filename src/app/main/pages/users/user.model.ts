export class User {
    uid = null;
    admin = null;
    ambassador = null;
    branch = null;
    collegeId = null;
    collegeName = null;
    degree = null;
    email = null;
    name = null;
    phoneNumber = null;
    photoURL = null;
    rollNo = null;
    verified = null;
    yearOfCompletion = null;
    tcfId = null;
    registrations: {
        team: Array<{
            teamId: string,
            eventId: string,
            round: any
        }>,
        solo: Array<{
            eventId: string,
            round: any
        }>
    } = {
        team: [],
        solo: []
    };
    packages: Array<string>  = [];
    invoices: Array<string> = [];
    constructor(data?) {
        if (data) {
            this.updateUser(data);
        }
    }
    get profileScore() {
        let score = 0;
        Object.keys(this).forEach((key) => {
            if (
                [
                'name', 'email', 'verified', 'branch', 'rollNo',
                'degree', 'collegeName', 'yearOfCompletion',
                 'phoneNumber', 'photoURL', 'uid',
                ]
                .indexOf(key) !== -1
             && this[key]) {
                score += 9;
            }
        });
        if (score === 99) { score++; }
        return score;
    }
    get isNative() {
        return !!(this.collegeId === 'nitp');
    }
    get campusAmbassadorDescription() {
        return this.ambassador ? this.ambassador['rank'] 
        + ' Rank,' + this.ambassador['count'] + ' Referrals,' + this.ambassador['points'] + ' Points' : '-'; 
    }

    get teamRegistrationCount () {
        return (this.registrations.team && this.registrations.team.length) || 0;
    }
    get soloRegistrationCount () {
        return (this.registrations.solo && this.registrations.solo.length) || 0;
    }
    get packageCount() {
        return (this.packages && this.packages.length) || 0;
    }
    updateUser(obj) {

        // Object.keys(obj).forEach(key => {
        //     if (this[key] !== undefined) {
        //         this[key] = obj[key];
        //     }
        // });
        Object.assign(this, obj);
        const teamReg = (obj && obj.registrations && obj.registrations.team);
        const soloReg = (obj && obj.registrations && obj.registrations.solo);
        if (teamReg) {
        this.registrations.team = Object.keys(teamReg).map(eventId => {
            const teamId =  Object.keys(teamReg[eventId])[0];
            return {
                eventId,
                teamId,
                round: Object.keys(teamId)[0]
            };
        });
        } else {
            this.registrations.team = [];
        }
        if (soloReg) {
            this.registrations.solo = Object.keys(soloReg).map(key => {
                return {
                    eventId: key,
                    round: soloReg[key]
                };
            });
        } else {
            this.registrations.solo = [];
        }
    }
    
}
export class Package {
    id: string;
    name: string;
    description: string;
    payment: PaymentOptions;
    constructor(data?) {
        this.id = (data && data.id) || null;
        this.name = (data && data.name) || null;
        this.description = (data && data.description) || null;
        this.payment = new PaymentOptions(data && data.payment);
    }
    get materialIcon() {
        if (this.id && PackageMaterialIcons[this.id]) {
            return PackageMaterialIcons[this.id];
        }
        return 'donut_large';
    }
    get materialClass() {
        if (this.id && PackageMaterialClasses[this.id]) {
           return {
                 [PackageMaterialClasses[this.id]]: true,
                 'mr-4': true
            };
        }
        return {
            'mr-4': true,
            'fuse-black' : true
         };
    }
}
 export enum PackageMaterialIcons {
    'cultural-events'=  'brush',
    'hackathon' = 'computer',
    'parliamentary-debate' = 'question_answer',
    'pratibimb' = 'people_outline',
    'robowars' = 'android',
    'technical-events' = 'settings',
    'technical-cultural-combo' = 'grade'
}
export enum PackageMaterialClasses {
    'cultural-events'=  'purple',
    'hackathon' = 'primary',
    'parliamentary-debate' = 'teal',
    'pratibimb' = 'accent',
    'robowars' = 'brown',
    'technical-events' = 'fuse-black',
    'technical-cultural-combo' = 'pink'
}
 class PaymentOptions {
    nitp: number;
    other: number;
    constructor(data?) {
        this.nitp = ((data && data.nitp) || null);
        this.other = ((data && data.other) || null);
    }
}
