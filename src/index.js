import angular from 'angular';
import {DevAppModule} from 'iloop-frontend-core';
import {PathwayVisModule} from './pathwayvis/pathwayvis.module';
export {PathwayVisModule} from './pathwayvis/pathwayvis.module';


export const PathwayVisAppModule = angular.module('PathwayVisApp', [
	DevAppModule.name,
    PathwayVisModule.name
]);
