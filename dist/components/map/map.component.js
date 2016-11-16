"use strict";
/// <reference path="../../../typings/escher.d.ts"/>
var escher = require('escher');
var d3 = require('d3');
var _ = require('lodash');
// noinspection TypeScriptCheckImport
var decaf_common_1 = require('decaf-common');
require('../../services/actions/actions.service');
require('./views/map.component.css!');
var component = angular.module('pathwayvis.components.map', [
    'pathwayvis.services.actions'
]);
/**
 * Pathway map component
 */
var MapComponentCtrl = (function () {
    /* @ngInject */
    function MapComponentCtrl($scope, api, actions) {
        var _this = this;
        this._api = api;
        this.actions = actions;
        this.$scope = $scope;
        // Map watcher
        $scope.$watch('ctrl.shared.map.map', function () {
            // Be careful that you init map only once!
            if (!_.isEmpty(_this.shared.map.map) && !_this._builder) {
                _this._initMap();
            }
        }, true);
        // Reaction data watcher
        $scope.$watch('ctrl.shared.map.reactionData', function () {
            if (!_.isEmpty(_this.shared.map.reactionData)) {
                _this._loadData();
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
            reaction_no_data_size: 10
        };
    }
    /**
     * Initializes map
     */
    MapComponentCtrl.prototype._initMap = function () {
        this._builder = escher.Builder(this.shared.map.map, null, null, d3.select('.map-container'), this.shared.map.settings);
        if (!_.isEmpty(this.shared.map.model))
            this._loadModel();
        this._loadContextMenu();
    };
    /**
     * Loads model to the map
     */
    MapComponentCtrl.prototype._loadModel = function () {
        this._builder.load_model(this.shared.map.model.data);
    };
    /**
     * Loads data to the map
     * TODO: handle metabolite and gene data
     */
    MapComponentCtrl.prototype._loadData = function () {
        this._builder.set_reaction_data(this.shared.map.reactionData);
    };
    /**
     * Loads context menu and fetches list of actions for selected map element
     */
    MapComponentCtrl.prototype._loadContextMenu = function () {
        var _this = this;
        var selection = this._builder.selection;
        var contextMenu = d3.select('.map-context-menu');
        selection.selectAll('.reaction, .reaction-label')
            .style('cursor', 'pointer')
            .on('contextmenu', function (d) {
            _this.contextActions = _this.actions.getList({ type: 'map:reaction' });
            _this.contextElement = d;
            _this._renderContextMenu(contextMenu, selection);
            d3.event.preventDefault();
        });
        d3.select(document).on('click', function () {
            contextMenu.style('display', 'none');
        });
    };
    /**
     * Renders and positions context menu based on selected element
     */
    MapComponentCtrl.prototype._renderContextMenu = function (contextMenu, selection) {
        var position = d3.mouse(selection.node());
        contextMenu.style('position', 'absolute')
            .style('left', position[0] + "px")
            .style('top', position[1] + "px")
            .style('display', 'inline-block');
        this.$scope.$apply();
    };
    /**
     * Callback function for clicked action button in context menu
     */
    MapComponentCtrl.prototype.onActionClick = function (action, data) {
        return this.actions.callAction(action, { object: data });
    };
    return MapComponentCtrl;
}());
var MapComponent = {
    controller: MapComponentCtrl,
    controllerAs: 'ctrl',
    templateUrl: decaf_common_1.dirname(module.id) + "/views/map.component.html",
    bindings: {
        shared: '='
    }
};
// Register component
component.component('pvMap', MapComponent);

//# sourceMappingURL=map.component.js.map
