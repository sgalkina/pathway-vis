"use strict";
require('./views/sidebar.component.css!');
var component = angular.module('pathwayvis.components.sidebar', []);
/**
 * sidebar component
 */
var SidebarComponentCtrl = (function () {
    /* @ngInject */
    function SidebarComponentCtrl(api, $http) {
        this.loadData = {};
        this._api = api;
        this._http = $http;
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
        this._api.get('strains/:id/model/fluxes', { id: 2 }).then(function (response) {
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
