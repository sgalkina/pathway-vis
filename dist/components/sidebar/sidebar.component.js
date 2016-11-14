"use strict";
var _ = require('lodash');
// noinspection TypeScriptCheckImport
var decaf_common_1 = require('decaf-common');
require('./views/sidebar.component.css!');
var component = angular.module('pathwayvis.components.sidebar', []);
/**
 * sidebar component
 */
var SidebarComponentCtrl = (function () {
    /* @ngInject */
    function SidebarComponentCtrl($scope, $http, $q, api) {
        var _this = this;
        this.loadData = {};
        this.selected = {};
        this._api = api;
        this._http = $http;
        this._q = $q;
        this._api.get('experiments').then(function (response) {
            _this.experiments = response.data;
        });
        $scope.$watch('ctrl.selected.experiment', function () {
            if (!_.isEmpty(_this.selected.experiment)) {
                _this._api.get('experiments/:id/strains', { id: _this.selected.experiment }).then(function (response) {
                    _this.strains = response.data;
                });
            }
        });
    }
    // Loads iJO1366 predefined map and model from API
    SidebarComponentCtrl.prototype.onLoadDataSubmit = function ($event) {
        var _this = this;
        var mapUri = 'https://raw.githubusercontent.com/escher/escher-demo/gh-pages/minimal_embedded_map/e_coli.iJO1366.central_metabolism.json';
        this.shared.loading++;
        var mapPromise = this._http({ method: 'GET', url: mapUri });
        var modelPromise = this._api.get('strains/:id/model', { id: this.selected.strain });
        this._q.all([mapPromise, modelPromise]).then(function (responses) {
            _this.shared.map.map = responses[0].data;
            _this.shared.map.model = responses[1].data;
            _this.shared.loading--;
        });
    };
    SidebarComponentCtrl.prototype.onLoadFluxClick = function ($event) {
        var _this = this;
        this.shared.loading++;
        this._api.get('strains/:id/model/fluxes', { id: this.selected.strain }).then(function (response) {
            // Remove zero values
            _this.shared.map.reactionData = _.pickBy(response.data, function (value) {
                if (Math.abs(value) > Math.pow(10, -7))
                    return true;
            });
            _this.shared.loading--;
        });
    };
    return SidebarComponentCtrl;
}());
var SidebarComponent = {
    controller: SidebarComponentCtrl,
    controllerAs: 'ctrl',
    templateUrl: decaf_common_1.dirname(module.id) + "/views/sidebar.component.html",
    bindings: {
        shared: '='
    }
};
// Register component
component.component('pvSidebar', SidebarComponent);

//# sourceMappingURL=sidebar.component.js.map
