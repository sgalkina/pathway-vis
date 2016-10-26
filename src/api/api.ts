import * as angular from 'angular';
import * as jQuery from 'jquery';

const api = angular.module('pathwayvis.services.api', []);

// API url
export const API_ROOT_URL = 'http://api.dd-decaf.eu/';

export class APIService {
    private _http: angular.IHttpService;

    constructor($http: angular.IHttpService) {
        this._http = $http;
    }

    private _request(method: string, path: string, data: Object, params: Object) {

        const requestUrl = API_ROOT_URL + path;

        return this._http({
            method: method,
            data: data,
            url: requestUrl,
            params: params
        });
    }

    public get(path: string, parameters: Object = {}): angular.IPromise<T> {
        return this._request('GET', path, undefined, parameters);
    }

    public post(path: string, data: Object, parameters: Object = {}): angular.IPromise<T> {
        return this._request('POST', path, data, parameters);
    }

    public put(path: string, data: Object, parameters: Object = {}): angular.IPromise<T> {
        return this._request('PUT', path, data, parameters);
    }

    public patch(path: string, data: Object, parameters: Object = {}): angular.IPromise<T> {
        return this._request('PATCH', path, data, parameters);
    }

    public delete(path: string, data: Object, parameters: Object = {}): angular.IPromise<T> {
        return this._request('DELETE', path, data, parameters);
    }
}

api.service('api', APIService);
export default api;
