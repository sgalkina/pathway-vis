"use strict";
require('./map/map.component');
require('./sidebar/sidebar.component');
require('./sidebar/sections/knockout.section');
var module = angular.module('pathwayvis.components', [
    'pathwayvis.components.map',
    'pathwayvis.components.sidebar',
    'pathwayvis.components.sections.knockout'
]);

//# sourceMappingURL=base.js.map
