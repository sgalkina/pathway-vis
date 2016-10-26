/**
 * Sidebar component
 */
const component = angular.module('pathwayvis.components.sidebar', []);

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

component.component('sidebar', SidebarComponent);
