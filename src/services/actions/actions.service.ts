import * as angular from 'angular';
import * as _ from 'lodash';

import {APIService} from '../api';
import {Action, ReactionAction} from './base';

import * as types from '../../types';

/**
 * Creates @registerAction decorator that is used for registering new actions
 */
export let actionsList = [];
export function registerAction(ActionClass) {
    const action = new ActionClass();
    actionsList.push(action);
}

const actions = angular.module('pathwayvis.services.actions', []);

/**
 * Actions service provides all registered actions as injectable service.
 */
export class ActionsService {
    private $injector: angular.auto.IInjectorService;

    constructor($injector: angular.auto.IInjectorService) {
        this.$injector = $injector;
    }

    /**
     * Returns list of all actions filtered by context
     * @param  {[type]} context Object used to filter actions by
     * @return {types.Action[]} List of actions
     */
    public getList(context): types.Action[] {
        return _.filter(actionsList, (action: types.Action) => action.canDisplay(context));
    }

    /**
     * Invokes action callback with injected arguments
     * @param {[type]} action Callback function from action
     * @param {Object} args Object with arguments that is applied to `this` in action class
     */
    public callAction(action, args: Object) {
        return this.$injector.invoke(action.callback, args);
    }
}

actions.service('actions', ActionsService);

/**
 * Knockout reaction
 */
@registerAction
class Knockout extends ReactionAction {
    public label = 'Knockout';
    public object: any;

    // @ngInject
    public callback(api: APIService): void {

    }
}

