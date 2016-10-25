import * as escher from 'escher';

// import './views/map.component.css!';

/**
 * Pathway map component
 */
class MapComponentCtrl {
    public title: string;

    /* @ngInject */
    constructor () {
        this.title = "title";
        console.log(escher);
    }
}

const MapComponent = {
    controller: MapComponentCtrl,
    controllerAs: 'ctrl',
    templateUrl: '/components/map/views/map.component.html'
}

const component = angular.module('pathwayvis.components.map', []).component('map', MapComponent);
