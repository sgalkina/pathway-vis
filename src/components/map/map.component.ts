/// <reference path="../../../typings/escher.d.ts"/>
import * as escher from 'escher';
import * as d3 from 'd3';
import * as _ from 'lodash';

// noinspection TypeScriptCheckImport
import {dirname} from 'decaf-common';
import {APIService} from '../../services/api';
import {WSService} from '../../services/ws';
import {ActionsService} from '../../services/actions/actions.service';

import * as types from '../../types';
import '../../services/actions/actions.service';

import './views/map.component.css!';
const component = angular.module('pathwayvis.components.map', [
    'pathwayvis.services.actions'
]);

/**
 * Pathway map component
 */
class MapComponentCtrl {
    public title: string;
    public shared: types.Shared;
    public actions: ActionsService;
    public contextActions: types.Action[];
    public contextElement: Object;

    private _builder: any;
    private _api: APIService;
    private _ws: WSService;
    private $scope: angular.IScope;

    /* @ngInject */
    constructor ($scope: angular.IScope, api: APIService, actions: ActionsService, ws: WSService) {
        this._api = api;
        this._ws = ws;
        this.actions = actions;
        this.$scope = $scope;

        // Map watcher
        $scope.$watch('ctrl.shared.map.map', () => {
            // Be careful that you init map only once!
            if (!_.isEmpty(this.shared.map.map) && !this._builder) {
                this._initMap();
            }
        }, true);

        // Reaction data watcher
        $scope.$watch('[ctrl.shared.map.reactionData, shared.map.reactionData]', () => {
            if (this.shared.map.reactionData) {
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
                { type: 'min', color: '#D4E6F0', size: 20 },
                { type: 'median', color: '#78b2d1', size: 20 },
                { type: 'max', color: '#0776AC', size: 20 }
            ],
            reaction_no_data_color: '#CBCBCB',
            reaction_no_data_size: 10,
        };

        $scope.$on("$destroy", function handler() {
            ws.close();
        });
    }

    /**
     * Initializes map
     */
    private _initMap(): void {
        this._builder = escher.Builder(this.shared.map.map, null, null, d3.select('.map-container'), this.shared.map.settings);
        if (!_.isEmpty(this.shared.map.model)) this._loadModel();
        this._loadContextMenu();
        this._enableKnockout();
    }

    /**
     * Loads model to the map
     */
    private _loadModel(): void {
        this._builder.load_model(this.shared.map.model.data);
    }

    /**
     * Loads data to the map
     * TODO: handle metabolite and gene data
     */
    private _loadData(): void {

        // Remove zero values
        let reactionData = _.pickBy(this.shared.map.reactionData, (value: number) => {
            if (Math.abs(value) > Math.pow(10, -7)) return true;
        });

        this._builder.set_reaction_data(reactionData);
    }

    /**
     * Loads context menu and fetches list of actions for selected map element
     */
    private _loadContextMenu(): void {
        const selection = this._builder.selection;
        const contextMenu = d3.select('.map-context-menu');

        selection.selectAll('.reaction, .reaction-label')
            .style('cursor', 'pointer')
            .on('contextmenu', (d) => {
                this.contextElement = d;
                this.contextActions = this.actions.getList({
                    type: 'map:reaction',
                    shared: this.shared,
                    element: this.contextElement
                });

                if (this.contextElement) {
                    this._renderContextMenu(contextMenu, selection);
                    d3.event.preventDefault();
                }
            });

        d3.select(document).on('click', () => {
            contextMenu.style('display', 'none');
        });
    }

    /**
     * Renders and positions context menu based on selected element
     */
    private _renderContextMenu(contextMenu, selection): void {
        const position = d3.mouse(selection.node());
        contextMenu.style('position', 'absolute')
            .style('left', position[0] + "px")
            .style('top', position[1] + "px")
            .style('display', 'inline-block');
        this.$scope.$apply();
    }

    private _enableKnockout(): void {
        this._ws.connect(true, this.shared.map.model.id);
    }

    /**
     * Callback function for clicked action button in context menu
     */
    public onActionClick(action, data) {
        let shared = {
            element: data,
            shared: this.shared
        };

        this.actions.callAction(action, shared).then((response) => {
            this.shared.map.growthRate = response['growth-rate'];
            this.shared.map.removedReactions = response['removed-reactions'];
            this.shared.map.reactionData = response['fluxes'];
            this.$scope.$apply();
        });
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
