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
                        id       : 'users-list',
                        title    : 'User List',
                        translate: 'NAV.DASHBOARDS',
                        type     : 'item',
                        icon: 'list',
                        url     : 'pages/users/list',
                    }
                ]
            }
        ]
    },

];
export const userProfileNav = {
    id       : 'user-profile',
    title    : 'User Profile',
    translate: 'NAV.DASHBOARDS',
    type     : 'item',
    icon     : 'person',
    url: 'pages/users/profile'
};

