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
    private _api: APIService;
    private _http: angular.IHttpService;

    /* @ngInject */
    constructor (api: APIService, $http: angular.IHttpService) {
        this.loadData = {};
        this._api = api;
        this._http = $http;
    }

    public onLoadDataSubmit($event): void {
        const mapUri = 'https://raw.githubusercontent.com/escher/escher-demo/gh-pages/minimal_embedded_map/e_coli.iJO1366.central_metabolism.json';
        this.shared.loading++;

        this._http({ method: 'GET', url: mapUri }).then((response: any) => {
            this.shared.map.map = response.data;
            this.shared.loading--;
        });
    }

    public onLoadFluxClick($event): void {
        this.shared.loading++;

        this._api.get('strains/:id/model/fluxes', {id: 2}).then((response: any) => {
            this.shared.map.reactionData = response.data;
            this.shared.loading--;
        });
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
