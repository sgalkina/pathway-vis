import * as _ from 'lodash';

import {WSService} from '../../../services/ws';
import * as types from '../../../types';
// noinspection TypeScriptCheckImport
import {dirname} from 'decaf-common';

const section = angular.module('pathwayvis.components.sections.knockout', [
]);

/**
 * Knockout component
 */
class KnockoutComponentCtrl {
    public shared: types.Shared;
    public growthRate: string;
    public removedReactions: string[];
    private _ws: WSService;

    /* @ngInject */
    constructor ($scope: angular.IScope, ws: WSService) {
        this._ws = ws;

        // Reaction data watcher
        $scope.$watch('[ctrl.shared.map.growthRate, ctrl.shared.map.removedReactions]', () => {
            if (this.shared.map.growthRate) {
                this.growthRate = this.shared.map.growthRate;
                this.removedReactions = this.shared.map.removedReactions;
            }
        }, true);
    }
}

const KnockoutComponent: angular.IComponentOptions = {
    controller: KnockoutComponentCtrl,
    controllerAs: 'ctrl',
    templateUrl: `${dirname(module.id)}/views/knockout.section.html`,
    bindings: {
        shared: '='
    }
}

// Register component
section.component('pvKnockout', KnockoutComponent);
