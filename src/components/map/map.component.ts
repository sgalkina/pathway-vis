/// <reference path="../../../typings/escher.d.ts"/>
import * as escher from 'escher';
import * as d3 from 'd3';

import {APIService} from '../../api/api';

import './views/map.component.css!';
const component = angular.module('pathwayvis.components.map', []);

/**
 * Pathway map component
 */
class MapComponentCtrl {
    public title: string;

    /* @ngInject */
    constructor ($http: angular.IHttpService, api: APIService) {

        const uri = 'https://raw.githubusercontent.com/escher/escher-demo/gh-pages/minimal_embedded_map/e_coli.iJO1366.central_metabolism.json';

        d3.json(uri, (e, data) => {
            var options = { menu: 'zoom', never_ask_before_quit: true };
            var b = escher.Builder(data, null, null, d3.select('.map-container'), this.mapOptions);
        });

        api.get('strains/:id/model', {id: 2, atrS: 'lala', bb: 33}).then((data) => {
            console.log(data);
        })
    }
}

const MapComponent = {
    controller: MapComponentCtrl,
    controllerAs: 'ctrl',
    templateUrl: '/components/map/views/map.component.html'
}

// Register component
component.component('pvMap', MapComponent);
