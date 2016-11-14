import * as _ from 'lodash';

import {APIService} from '../../api/api';
import * as types from '../../types';
// noinspection TypeScriptCheckImport
import {dirname} from 'decaf-common';

import './views/sidebar.component.css!';

interface SelectedItems {
    experiment?: number;
    strain?: number;
}

const component = angular.module('pathwayvis.components.sidebar', [
]);

/**
 * sidebar component
 */
class SidebarComponentCtrl {
    public shared: types.Shared;
    public loadData: Object = {};
    public selected: SelectedItems = {};
    public experiments: types.Experiment[];
    public strains: types.Strain[];

    private _api: APIService;
    private _http: angular.IHttpService;
    private _q: angular.IQService;

    /* @ngInject */
    constructor ($scope: angular.IScope, $http: angular.IHttpService, $q: angular.IQService, api: APIService) {
        this._api = api;
        this._http = $http;
        this._q = $q;

        this._api.get('experiments').then((response: any) => {
            this.experiments = response.data;
        });

        $scope.$watch('ctrl.selected.experiment', () => {
            if (!_.isEmpty(this.selected.experiment)) {
                this._api.get('experiments/:id/strains', {id: this.selected.experiment}).then((response: any) => {
                    this.strains = response.data;
                });
            }
        });
    }

    // Loads iJO1366 predefined map and model from API
    public onLoadDataSubmit($event): void {
        const mapUri = 'https://raw.githubusercontent.com/escher/escher-demo/gh-pages/minimal_embedded_map/e_coli.iJO1366.central_metabolism.json';
        this.shared.loading++;

        const mapPromise = this._http({ method: 'GET', url: mapUri });
        const modelPromise = this._api.get('strains/:id/model', {id: this.selected.strain});

        this._q.all([mapPromise, modelPromise]).then((responses: any) => {
            this.shared.map.map = responses[0].data;
            this.shared.map.model = responses[1].data;

            this.shared.loading--;
        });


    }

    public onLoadFluxClick($event): void {
        this.shared.loading++;

        this._api.get('strains/:id/model/fluxes', {id: this.selected.strain}).then((response: any) => {

            // Remove zero values
            this.shared.map.reactionData = _.pickBy(response.data, (value: number) => {
                if (Math.abs(value) > Math.pow(10, -7)) return true;
            });

            this.shared.loading--;
        });
    }
}

const SidebarComponent: angular.IComponentOptions = {
    controller: SidebarComponentCtrl,
    controllerAs: 'ctrl',
    templateUrl: `${dirname(module.id)}/views/sidebar.component.html`,
    bindings: {
        shared: '='
    }
}

// Register component
component.component('pvSidebar', SidebarComponent);
