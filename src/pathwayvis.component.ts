/// <reference path="../typings/index.d.ts"/>
import * as angular from 'angular';

// Turn of WS TS inspection for the 'decaf-common' import.
// noinspection TypeScriptCheckImport
import {Config, dirname} from 'decaf-common';

import './api/api';
import './components/base';
import './views/pathwayvis.component.css!';

export const COMPONENT_NAME = 'pathwayvis';
const main = angular.module(COMPONENT_NAME, [
    'pathwayvis.services.api',
    'pathwayvis.components'
]);

// TODO: we need to make it so the module name and the .register() are decoupled and not dependant on each other
main.config(function (platformProvider) {
    platformProvider
        .register(COMPONENT_NAME, {
            sharing: {
                accept: [{type: 'money', multiple: true}],
                name: 'Decaf Visualisations Component'
            }
        })
        .state(COMPONENT_NAME, {
            url: `/${COMPONENT_NAME}`,
            views: {
                'content@': {
                    templateUrl: `${dirname(module.id)}/views/pathwayvis.component.html`,
                    controller: PathwayVisComponentController,
                    controllerAs: 'ctrl'
                }
            },
            onEnter(config: Config) {
                // Turn of WS inspection for TS
                // noinspection TypeScriptUnresolvedFunction
                config.set('color', '#ff5200');
            },
            onExit(config: Config) {
                // Turn of WS inspection for TS
                // noinspection TypeScriptUnresolvedFunction
                config.set('color', null);
            }
        });
});


class PathwayVisComponentController {
    constructor(config: Config, sharing) {
        // Turn of WS inspection for TS
        // noinspection TypeScriptUnresolvedFunction
        let component = config.get('componentConfig');
        // Data from the sharing provider
        let money = sharing.items('money');
    }
}

export default main;
