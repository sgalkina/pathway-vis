import './map/map.component';
import './sidebar/sidebar.component';
import './sidebar/sections/knockout.section';

const module: angular.IModule = angular.module('pathwayvis.components', [
    'pathwayvis.components.map',
    'pathwayvis.components.sidebar',
    'pathwayvis.components.sections.knockout'
]);
