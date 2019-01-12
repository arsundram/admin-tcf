import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        icon     : 'apps',
        children : [
             {
                id       : 'events',
                title    : 'Events',
                translate: 'NAV.DASHBOARDS',
                type     : 'collapsable',
                icon     : 'dashboard'
            },
            {
                id       : 'users',
                title    : 'Users',
                translate: 'NAV.DASHBOARDS',
                type     : 'collapsable',
                icon     : 'group',
                children: [
                    {
                        id       : 'user-profile',
                        title    : 'User Profile',
                        translate: 'NAV.DASHBOARDS',
                        type     : 'item',
                        icon     : 'person',
                        url: 'pages/users/profile'
                    }
                ]
            },
            {
                id       : 'live-stream',
                title    : 'Live Streaming',
                translate: 'NAV.DASHBOARDS',
                type     : 'item',
                icon     : 'slow_motion_video',
                url: 'pages/live-stream'
            }
        ]
    },

];
export const campusAmbassadorNav = {
    id       : 'campus-ambassador-program',
    title    : 'Campus Ambassador',
    translate: 'NAV.DASHBOARDS',
    type     : 'item',
    icon: 'list',
    url     : 'pages/users/campus-ambassador-program',
};
export const festAnalyticsNav = {
    id       : 'fest-analytics',
    title    : 'Fest Analytics',
    translate: 'NAV.DASHBOARDS',
    type     : 'item',
    icon: 'show_chart',
    url     : 'pages/fest-analytics'
};





