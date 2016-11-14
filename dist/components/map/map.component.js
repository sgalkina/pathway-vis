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
                { type: 'min', color: '#D4E6F0', size: 20 },
                { type: 'median', color: '#78b2d1', size: 20 },
                { type: 'max', color: '#0776AC', size: 20 }
            ],
            reaction_no_data_color: '#CBCBCB',
            reaction_no_data_size: 10
        };
    }
    MapComponentCtrl.prototype._initMap = function () {
        this._builder = escher.Builder(this.shared.map.map, null, null, d3.select('.map-container'), this.shared.map.settings);
        if (!_.isEmpty(this.shared.map.model))
            this._loadModel();
    };
    MapComponentCtrl.prototype._loadModel = function () {
        this._builder.load_model(this.shared.map.model);
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
