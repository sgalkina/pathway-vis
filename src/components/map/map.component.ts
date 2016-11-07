/// <reference path="../../../typings/escher.d.ts"/>
import * as escher from 'escher';
import * as d3 from 'd3';
import * as _ from 'lodash';
// noinspection TypeScriptCheckImport
import {dirname} from 'decaf-common';

import {APIService} from '../../api/api';
import * as types from '../../types';

import './views/map.component.css!';
const component = angular.module('pathwayvis.components.map', []);

/**
 * Pathway map component
 */
class MapComponentCtrl {
    public title: string;
    public shared: types.Shared;
    private _builder: any;
    private _api: APIService;

    /* @ngInject */
    constructor ($scope: angular.IScope, api: APIService) {
        this._api = api;

        $scope.$watch('ctrl.shared.map.map', () => {
            // Be careful that you init map only once!
            if (!_.isEmpty(this.shared.map.map) && !this._builder) {
                this._initMap();
            }
        }, true);

        $scope.$watch('ctrl.shared.map.reactionData', () => {
            if (!_.isEmpty(this.shared.map.reactionData)) {
                this._loadData();
            }
        }, true);

        // Default map settings
        this.shared.map.settings = {
            menu: 'zoom',
            never_ask_before_quit: true,
            reaction_styles: ['color', 'size', 'text', 'abs'],
            identifiers_on_map: 'bigg_id',
            hide_all_labels: false,
            hide_secondary_metabolites: false,
            reaction_scale: [
                { type: 'min', color: '#2664a3', size: 20 },
                { type: 'median', color: '#e1e1e1', size: 20 },
                { type: 'max', color: '#c2263f', size: 20 }
            ],
            reaction_no_data_color: '#c7c7c7',
            reaction_no_data_size: 3
        };
    }

    public _initMap(): void {
        let options = { menu: 'zoom', never_ask_before_quit: true, reaction_styles: ['color', 'size', 'text', 'abs'] };
        this._builder = escher.Builder(this.shared.map.map, null, null, d3.select('.map-container'), this.shared.map.settings);
    }

    public _loadData(): void {
        this._builder.set_reaction_data(this.shared.map.reactionData);
    }
}

const MapComponent: angular.IComponentOptions = {
    controller: MapComponentCtrl,
    controllerAs: 'ctrl',
    templateUrl: `${dirname(module.id)}/views/map.component.html`,
    bindings: {
        shared: '='
    }
}

// Register component
component.component('pvMap', MapComponent);
