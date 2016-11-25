import * as _ from 'lodash';

import {APIService} from '../../services/api';
import * as types from '../../types';
// noinspection TypeScriptCheckImport
import {dirname} from 'decaf-common';

import './views/sidebar.component.css!';

interface SelectedItems {
    experiment?: number;
    sample?: number;
    phase?: number;
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
    public samples: types.Sample[];
    public phases: types.Phase[];
    public info: Object = {};

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
                this._api.get('experiments/:experimentId/samples', {
                    experimentId: this.selected.experiment
                }).then((response: any) => {
                    this.samples = response.data;
                });
            }
        });

        $scope.$watch('ctrl.selected.sample', () => {
            if (!_.isEmpty(this.selected.sample)) {
                this._api.get('samples/:sampleId/phases', {
                    sampleId: this.selected.sample
                }).then((response: any) => {
                    this.phases = response.data;
                });
            }
        });
    }

    // Loads iJO1366 predefined map and model from API
    public onLoadDataSubmit($event): void {
        const mapUri = 'https://raw.githubusercontent.com/escher/escher-demo/gh-pages/minimal_embedded_map/e_coli.iJO1366.central_metabolism.json';
        this.shared.loading++;

        const mapPromise = this._http({ method: 'GET', url: mapUri });
        const modelPromise = this._api.get('samples/:sampleId/model', {
            'sampleId': this.selected.sample,
            'phase-id': this.selected.phase,
            'with-fluxes': 1
        });

		const infoPromise = this._api.get('samples/:sampleId/info', {
            'sampleId': this.selected.sample,
            'phase-id': this.selected.phase,
        });

        this._q.all([mapPromise, modelPromise, infoPromise]).then((responses: any) => {

            // Add loaded data to shared scope
            this.shared.map.map = responses[0].data;
            this.shared.map.model = {
                id: responses[1].data['model-id'],
                data: responses[1].data['model']
            };

            this.shared.map.reactionData = responses[1].data['fluxes'];
            this.shared.loading--;

			this.info = responses[2].data;
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
