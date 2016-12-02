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
    public growthRate: number;
    public removedReactions: string[];
    private _ws: WSService;

    /* @ngInject */
    constructor ($scope: angular.IScope, toastr: angular.toastr.IToastrService, ws: WSService) {
        this._ws = ws;

        // Reaction data watcher
        $scope.$watch('[ctrl.shared.map.growthRate, ctrl.shared.map.removedReactions]', () => {
            if (this.shared.map.growthRate) {
                this.growthRate = this.shared.map.growthRate;
                this.removedReactions = this.shared.map.removedReactions;

                if (_.round(this.growthRate, 5) === 0) {
                    toastr.warning('Growth rate is 0!', '', {
                        closeButton: true,
                        timeOut: 0,
                        extendedTimeOut: 0
                    });
                }
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
