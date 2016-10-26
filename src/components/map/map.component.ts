/// <reference path="../../../typings/escher.d.ts"/>
import * as escher from 'escher';
import * as d3 from 'd3';

// import './views/map.component.css!';

/**
 * Pathway map component
 */
class MapComponentCtrl {
    public title: string;

    /* @ngInject */
    constructor ($http: angular.IHttpService) {

        const uri = 'https://raw.githubusercontent.com/escher/escher-demo/gh-pages/minimal_embedded_map/e_coli.iJO1366.central_metabolism.json';

        d3.json(uri, function(e, data) {
            var options = { menu: 'zoom', fill_screen: true };
            var b = escher.Builder(data, null, null, d3.select('.map-container'), options);
        });
    }
}

const MapComponent = {
    controller: MapComponentCtrl,
    controllerAs: 'ctrl',
    templateUrl: '/components/map/views/map.component.html'
}

const component = angular.module('pathwayvis.components.map', []).component('map', MapComponent);
