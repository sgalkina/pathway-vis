import * as _ from 'lodash';

import {dirname} from 'decaf-common';
import {WSService} from '../../../services/ws';
import {ActionsService} from '../../../services/actions/actions.service';

import * as types from '../../../types';

import './views/knockout.section.css!';

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
    private _actions: ActionsService;
    private $scope: angular.IScope;

    /* @ngInject */
    constructor ($scope: angular.IScope, toastr: angular.toastr.IToastrService, actions: ActionsService, ws: WSService) {
        this._ws = ws;
        this._actions = actions;
        this.$scope = $scope;

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

    public onReactionRemoveClick(selectedReaction: string): void {

        const undoKnockoutAction = this._actions.getAction('reaction:knockout:undo');
        let shared = {
            element: {
                bigg_id: selectedReaction
            },
            shared: this.shared
        };

        this._actions.callAction(undoKnockoutAction, shared).then((response) => {
            this.shared.map.growthRate = parseFloat(response['growth-rate']);
            this.shared.map.removedReactions = response['removed-reactions'];
            this.shared.map.reactionData = response.fluxes;
            this.$scope.$apply();
        });
    }
}

const KnockoutComponent: angular.IComponentOptions = {
    controller: KnockoutComponentCtrl,
    controllerAs: 'ctrl',
    templateUrl: `${dirname(module.id)}/views/knockout.section.html`,
    bindings: {
        shared: '='
    }
};

// Register component
section.component('pvKnockout', KnockoutComponent);
