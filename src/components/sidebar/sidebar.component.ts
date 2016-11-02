import {APIService} from '../../api/api';
import * as types from '../../types';

import './views/sidebar.component.css!';
const component = angular.module('pathwayvis.components.sidebar', [
]);

/**
 * sidebar component
 */
class SidebarComponentCtrl {
    public shared: types.Shared;
    public loadData: Object;

    /* @ngInject */
    constructor (api: APIService) {
        this.loadData = {};
    }

    public onLoadDataSubmit($event): void {
        this.shared.mapData = {
            organism: 'Ecolo',
            map: {},
            model: {}
        }
    }
}

const SidebarComponent: angular.IComponentOptions = {
    controller: SidebarComponentCtrl,
    controllerAs: 'ctrl',
    templateUrl: '/components/sidebar/views/sidebar.component.html',
    bindings: {
        shared: '='
    }
}

// Register component
component.component('pvSidebar', SidebarComponent);
