"use strict";
/// <reference path="../../../typings/escher.d.ts"/>
var escher = require('escher');
var d3 = require('d3');
var _ = require('lodash');
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
    }
    MapComponentCtrl.prototype._initMap = function () {
        var options = { menu: 'zoom', never_ask_before_quit: true };
        this._builder = escher.Builder(this.shared.map.map, null, null, d3.select('.map-container'), options);
    };
    MapComponentCtrl.prototype._loadData = function () {
        this._builder.set_reaction_data(this.shared.map.reactionData);
    };
    return MapComponentCtrl;
}());
var MapComponent = {
    controller: MapComponentCtrl,
    controllerAs: 'ctrl',
    templateUrl: '/components/map/views/map.component.html',
    bindings: {
        shared: '='
    }
};
// Register component
component.component('pvMap', MapComponent);

//# sourceMappingURL=map.component.js.map
