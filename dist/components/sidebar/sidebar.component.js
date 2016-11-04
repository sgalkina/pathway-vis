"use strict";
var _ = require('lodash');
require('./views/sidebar.component.css!');
var component = angular.module('pathwayvis.components.sidebar', []);
/**
 * sidebar component
 */
var SidebarComponentCtrl = (function () {
    /* @ngInject */
    function SidebarComponentCtrl($scope, $http, api) {
        var _this = this;
        this.loadData = {};
        this.selected = {};
        this._api = api;
        this._http = $http;
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
    SidebarComponentCtrl.prototype.onLoadDataSubmit = function ($event) {
        var _this = this;
        var mapUri = 'https://raw.githubusercontent.com/escher/escher-demo/gh-pages/minimal_embedded_map/e_coli.iJO1366.central_metabolism.json';
        this.shared.loading++;
        this._http({ method: 'GET', url: mapUri }).then(function (response) {
            _this.shared.map.map = response.data;
            _this.shared.loading--;
        });
    };
    SidebarComponentCtrl.prototype.onLoadFluxClick = function ($event) {
        var _this = this;
        this.shared.loading++;
        this._api.get('strains/:id/model/fluxes', { id: this.selected.strain }).then(function (response) {
            _this.shared.map.reactionData = response.data;
            _this.shared.loading--;
        });
    };
    return SidebarComponentCtrl;
}());
var SidebarComponent = {
    controller: SidebarComponentCtrl,
    controllerAs: 'ctrl',
    templateUrl: '/components/sidebar/views/sidebar.component.html',
    bindings: {
        shared: '='
    }
};
// Register component
component.component('pvSidebar', SidebarComponent);

//# sourceMappingURL=sidebar.component.js.map
