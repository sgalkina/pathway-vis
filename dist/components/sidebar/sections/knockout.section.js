"use strict";
// noinspection TypeScriptCheckImport
var decaf_common_1 = require('decaf-common');
var section = angular.module('pathwayvis.components.sections.knockout', []);
/**
 * Knockout component
 */
var KnockoutComponentCtrl = (function () {
    /* @ngInject */
    function KnockoutComponentCtrl($scope, ws) {
        var _this = this;
        this._ws = ws;
        // Reaction data watcher
        $scope.$watch('[ctrl.shared.map.growthRate, ctrl.shared.map.removedReactions]', function () {
            if (_this.shared.map.growthRate) {
                _this.growthRate = _this.shared.map.growthRate;
                _this.removedReactions = _this.shared.map.removedReactions;
            }
        }, true);
    }
    return KnockoutComponentCtrl;
}());
var KnockoutComponent = {
    controller: KnockoutComponentCtrl,
    controllerAs: 'ctrl',
    templateUrl: decaf_common_1.dirname(module.id) + "/views/knockout.section.html",
    bindings: {
        shared: '='
    }
};
// Register component
section.component('pvKnockout', KnockoutComponent);

//# sourceMappingURL=knockout.section.js.map
