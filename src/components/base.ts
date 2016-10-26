import './map/map.component';
import './sidebar/sidebar.component';

const module: angular.IModule = angular.module('pathwayvis.components', [
    'pathwayvis.components.map',
    'pathwayvis.components.sidebar',
]);
