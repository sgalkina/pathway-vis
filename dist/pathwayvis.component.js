"use strict";
/// <reference path="../typings/index.d.ts"/>
var angular = require('angular');
// Turn of WS TS inspection for the 'decaf-common' import.
// noinspection TypeScriptCheckImport
var decaf_common_1 = require('decaf-common');
require('./services/api');
require('./services/ws');
require('./components/base');
require('./views/pathwayvis.component.css!');
exports.COMPONENT_NAME = 'pathwayvis';
var main = angular.module(exports.COMPONENT_NAME, [
    'pathwayvis.services.api',
    'pathwayvis.services.ws',
    'pathwayvis.components'
]);
// TODO: we need to make it so the module name and the .register() are decoupled and not dependant on each other
main.config(function (platformProvider) {
    platformProvider
        .register(exports.COMPONENT_NAME, {
        sharing: {
            accept: [{ type: 'money', multiple: true }],
            name: 'Decaf Visualisations Component'
        }
    })
        .state(exports.COMPONENT_NAME, {
        url: "/" + exports.COMPONENT_NAME,
        views: {
            'content@': {
                templateUrl: decaf_common_1.dirname(module.id) + "/views/pathwayvis.component.html",
                controller: PathwayVisComponentController,
                controllerAs: 'ctrl'
            }
        },
        onEnter: function (config) {
            // Turn of WS inspection for TS
            // noinspection TypeScriptUnresolvedFunction
            config.set('color', '#34495e');
        },
        onExit: function (config) {
            // Turn of WS inspection for TS
            // noinspection TypeScriptUnresolvedFunction
            config.set('color', null);
        }
    });
});
var PathwayVisComponentController = (function () {
    function PathwayVisComponentController(config, sharing) {
        // Turn of WS inspection for TS
        // noinspection TypeScriptUnresolvedFunction
        var component = config.get('componentConfig');
        // Data from the sharing provider
        var money = sharing.items('money');
        // Init shared scope
        this.shared = {
            loading: 0,
            map: {},
            sections: {}
        };
    }
    return PathwayVisComponentController;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = main;

//# sourceMappingURL=pathwayvis.component.js.map
