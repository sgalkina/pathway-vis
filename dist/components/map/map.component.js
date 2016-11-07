"use strict";
/// <reference path="../../../typings/escher.d.ts"/>
var escher = require('escher');
var d3 = require('d3');
var _ = require('lodash');
// noinspection TypeScriptCheckImport
var decaf_common_1 = require('decaf-common');
require('./views/map.component.css!');
var component = angular.module('pathwayvis.components.map', []);
/**
 * Pathway map component
 */
var MapComponentCtrl = (function () {
    /* @ngInject */
    function MapComponentCtrl($scope, api) {
        var _this = this;
        this._api = api;
        $scope.$watch('ctrl.shared.map.map', function () {
            // Be careful that you init map only once!
            if (!_.isEmpty(_this.shared.map.map) && !_this._builder) {
                _this._initMap();
            }
        }, true);
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
                { type: 'min', color: '#2664a3', size: 20 },
                { type: 'median', color: '#e1e1e1', size: 20 },
                { type: 'max', color: '#c2263f', size: 20 }
            ],
            reaction_no_data_color: '#c7c7c7',
            reaction_no_data_size: 3
        };
    }
    MapComponentCtrl.prototype._initMap = function () {
        var options = { menu: 'zoom', never_ask_before_quit: true, reaction_styles: ['color', 'size', 'text', 'abs'] };
        this._builder = escher.Builder(this.shared.map.map, null, null, d3.select('.map-container'), this.shared.map.settings);
    };
    MapComponentCtrl.prototype._loadData = function () {
        this._builder.set_reaction_data(this.shared.map.reactionData);
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
