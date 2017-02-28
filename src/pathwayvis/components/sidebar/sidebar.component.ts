import * as _ from 'lodash';
import 'angular-toastr';

import {APIService} from '../../services/api';
import * as types from '../../types';

import './views/sidebar.component.scss';
import * as template from './views/sidebar.component.html';
import * as ECO from './assets/maps/iJO1366.Central metabolism.json';
import * as SCE from './assets/maps/iMM904.Central carbon metabolism.json';

interface SelectedItems {
    experiment?: number;
    sample?: number;
    phase?: number;
    method?: string;
}

interface Method {
    id: string;
    name: string;
}

/**
 * sidebar component
 */
class SidebarComponentCtrl {
    public shared: types.Shared;
    public loadData: Object = {};
    public selected: SelectedItems = {};
    public methods: Method[];
    public experiments: types.Experiment[];
    public samples: types.Sample[];
    public samplesSpecies: any;
    public phases: types.Phase[];
    public info: Object;

    private _api: APIService;
    private _http: angular.IHttpService;
    private _q: angular.IQService;
    private _toastr: angular.toastr.IToastrService;

    /* @ngInject */
    constructor ($scope: angular.IScope,
                 $http: angular.IHttpService,
                 $q: angular.IQService,
                 toastr: angular.toastr.IToastrService,
                 api: APIService) {

        this._api = api;
        this._http = $http;
        this._q = $q;
        this._toastr = toastr;

        this.methods = [
            {'id': 'fba', 'name': 'FBA'},
            {'id': 'pfba', 'name': 'pFBA'},
            {'id': 'fva', 'name': 'FVA'},
            {'id': 'moma', 'name': 'MOMA'},
            {'id': 'lmoma', 'name': 'lMOMA'},
            {'id': 'room', 'name': 'ROOM'}
        ];
        this.selected.method = 'pfba';

        this._api.get('experiments').then((response: angular.IHttpPromiseCallbackArg<types.Experiment[]>) => {
            this.experiments = response.data;
        });

        this.samplesSpecies = {};

        $scope.$watch('ctrl.selected.experiment', () => {
            if (!_.isEmpty(this.selected.experiment)) {
                this._api.get('experiments/:experimentId/samples', {
                    experimentId: this.selected.experiment
                }).then((response: angular.IHttpPromiseCallbackArg<types.Sample[]>) => {
                    this.samples = response.data;
                    this.samples.forEach((value) => {
                        this.samplesSpecies[value.id] = value.organism;
                    });
                }, (error) => {
                    this._toastr.error('Oops! Sorry, there was a problem loading selected experiment.', '', {
                        closeButton: true,
                        timeOut: 10500
                    });
                });
            }
        });

        $scope.$watch('ctrl.selected.sample', () => {
            if (!_.isEmpty(this.selected.sample)) {
                this._api.get('samples/:sampleId/phases', {
                    sampleId: this.selected.sample
                }).then((response: angular.IHttpPromiseCallbackArg<types.Phase[]>) => {
                    this.phases = response.data;
                }, (error) => {
                    this._toastr.error('Oops! Sorry, there was a problem loading selected sample.', '', {
                        closeButton: true,
                        timeOut: 10500
                    });

                    this.shared.loading--;
                });
            }
        });
    }

    public onLoadDataSubmit($event?): void {
        const maps = {
            'ECO': ECO,
            'SCE': SCE
        };
        this.shared.loading++;

        const modelPromise = this._api.get('samples/:sampleId/model', {
            'sampleId': this.selected.sample,
            'phase-id': this.selected.phase,
            'method': this.selected.method,
            'with-fluxes': 1
        });

        const infoPromise = this._api.get('samples/:sampleId/info', {
            'sampleId': this.selected.sample,
            'phase-id': this.selected.phase
        });

        this._q.all([modelPromise, infoPromise]).then((responses: any) => {

            // Add loaded data to shared scope
            this.shared.map.map = maps[this.samplesSpecies[this.selected.sample]];
            this.shared.model = responses[0].data.model;
            this.shared.model.uid = responses[0].data['model-id'];
            this.shared.map.reactionData = responses[0].data.fluxes;
            this.shared.method = this.selected.method;
            this.info = responses[1].data;

            this.shared.loading--;
        }, (error) => {
            this._toastr.error('Oops! Sorry, there was a problem with fetching the data.', '', {
                closeButton: true,
                timeOut: 10500
            });

            this.shared.loading--;
        });
    }
}

export const SidebarComponent: angular.IComponentOptions = {
    controller: SidebarComponentCtrl,
    controllerAs: 'ctrl',
    template: template.toString(),
    bindings: {
        shared: '=',
        project: '<project'
    }
};

