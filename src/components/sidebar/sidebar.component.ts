/**
 * Sidebar component
 */

class SidebarCtrl {
    /* @ngInject */
    constructor () {
        console.log('sidebar');
    }
}

const SidebarComponent = {
    controller: SidebarCtrl,
    controlerAs: 'ctrl',
    template: 'sidebar'
}

const component = angular.module('pathwayvis.components.sidebar', []).component('sidebar', SidebarComponent);
