import * as _ from 'lodash';

interface RequestDetails {
    path: string;
    params: Object;
}

const ws = angular.module('pathwayvis.services.ws', []);

// WS url
export const WS_ROOT_URL = 'ws://api.dd-decaf.eu/wsmodels/';

export class WSService {

    public reconnectInterval: number = 1000;
    public timeoutInterval: number = 10000;
    public readyState: number;

    private _forcedClose: boolean = false;
    private _timedOut: boolean = false;
    private _ws: WebSocket;
    private _url: string;
    private _callbacks; // TODO: add type
    private _q: angular.IQService;
    private _requestID: string;

    public onopen: (ev: Event) => void = function (event: Event) {};
    public onclose: (ev:CloseEvent) => void = function (event: CloseEvent) {};
    public onconnecting: () => void = function () {};
    public onmessage: (ev:MessageEvent) => void = function (event: MessageEvent) {};
    public onerror: (ev:ErrorEvent) => void = function (event: ErrorEvent) {};

    constructor($q: angular.IQService) {
        this._callbacks = {};
        this._q = $q;
    }

    private _generateID(): string {
        return Math.random().toString(36).slice(2);
    }

    public connect(reconnectAttempt: boolean, path: string) {
        this.readyState = WebSocket.CONNECTING;
        this._url = WS_ROOT_URL + path;

        this._ws = new WebSocket(this._url);
        this.onconnecting();

        console.log('ReconnectingWebSocket', 'attempt-connect', this._url);

        var localWs = this._ws;

        var timeout = setTimeout(() => {
            console.log('ReconnectingWebSocket', 'connection-timeout', this._url);
            this._timedOut = true;
            localWs.close();
            this._timedOut = false;
        }, this.timeoutInterval);

        this._ws.onopen = (event:Event) => {
            clearTimeout(timeout);
            console.log('ReconnectingWebSocket', 'onopen', this._url);
            this.readyState = WebSocket.OPEN;
            reconnectAttempt = false;
            this.onopen(event);
        };

        this._ws.onclose = (event:CloseEvent) => {
            clearTimeout(timeout);
            this._ws = null;
            if (this._forcedClose) {
                this.readyState = WebSocket.CLOSED;
                this.onclose(event);
            } else {
                this.readyState = WebSocket.CONNECTING;
                this.onconnecting();
                if (!reconnectAttempt && !this._timedOut) {
                    console.log('ReconnectingWebSocket', 'onclose', this._url);
                    this.onclose(event);
                }
                setTimeout(() => {
                    this.connect(true, path);
                }, this.reconnectInterval);
            }
        };

        this._ws.onmessage = (event) => {
            const result = JSON.parse(event.data);
            return this._callbacks[this._requestID].resolve(result);
        };

        this._ws.onerror = (event) => {
            console.log('ReconnectingWebSocket', 'onerror', this._url, event);
            this.onerror(event);
        };
    }

    public send(data: any): angular.IPromise<any> {
        this._requestID = this._generateID();
        this._callbacks[this._requestID] = this._q.defer();

        if (this._ws) {
            this._ws.send(JSON.stringify(data));
            return this._callbacks[this._requestID].promise;
        } else {
            throw 'INVALID_STATE_ERR : Pausing to reconnect websocket';
        }
    }

    /**
     * Returns boolean, whether websocket was FORCEFULLY closed.
     */
    public close(): boolean {
        if (this._ws) {
            this._forcedClose = true;
            this._ws.close();
            return true;
        }
        return false;
    }

    /**
     * Additional public API method to refresh the connection if still open
     * (close, re-open). For example, if the app suspects bad data / missed
     * heart beats, it can try to refresh.
     *
     * Returns boolean, whether websocket was closed.
     */
    public refresh(): boolean {
        if (this._ws) {
            this._ws.close();
            return true;
        }
        return false;
    }
}

ws.service('ws', WSService);
export default ws;
