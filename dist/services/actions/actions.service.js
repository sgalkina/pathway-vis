"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var angular = require('angular');
var _ = require('lodash');
var base_1 = require('./base');
/**
 * Creates @registerAction decorator that is used for registering new actions
 */
exports.actionsList = [];
function registerAction(ActionClass) {
    var action = new ActionClass();
    exports.actionsList.push(action);
}
exports.registerAction = registerAction;
var actions = angular.module('pathwayvis.services.actions', []);
/**
 * Actions service provides all registered actions as injectable service.
 */
var ActionsService = (function () {
    function ActionsService($injector) {
        this.$injector = $injector;
    }
    /**
     * Returns list of all actions filtered by context
     * @param  {[type]} context Object used to filter actions by
     * @return {types.Action[]} List of actions
     */
    ActionsService.prototype.getList = function (context) {
        return _.filter(exports.actionsList, function (action) { return action.canDisplay(context); });
    };
    /**
     * Invokes action callback with injected arguments
     * @param {[type]} action Callback function from action
     * @param {Object} args Object with arguments that is applied to `this` in action class
     */
    ActionsService.prototype.callAction = function (action, args) {
        return this.$injector.invoke(action.callback, args);
    };
    return ActionsService;
}());
exports.ActionsService = ActionsService;
actions.service('actions', ActionsService);
/**
 * Knockout reaction
 */
var Knockout = (function (_super) {
    __extends(Knockout, _super);
    function Knockout() {
        _super.apply(this, arguments);
        this.label = 'Knockout';
    }
    // @ngInject
    Knockout.prototype.callback = function (api) {
    };
    Knockout = __decorate([
        registerAction, 
        __metadata('design:paramtypes', [])
    ], Knockout);
    return Knockout;
}(base_1.ReactionAction));

//# sourceMappingURL=actions.service.js.map
