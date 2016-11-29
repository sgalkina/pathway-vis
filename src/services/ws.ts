import * as _ from 'lodash';

interface RequestDetails {
    path: string;
    params: Object;
};

interface Callback {
    id: string;
    deffered: angular.IDeferred<any>;
    data: string;
};

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
    private _callbacks: Callback[] = [];
    private _q: angular.IQService;
    private _requestID: string;

    public onopen: (ev: Event) => void = function (event: Event) {};
    public onclose: (ev:CloseEvent) => void = function (event: CloseEvent) {};
    public onconnecting: () => void = function () {};
    public onmessage: (ev:MessageEvent) => void = function (event: MessageEvent) {};
    public onerror: (ev:ErrorEvent) => void = function (event: ErrorEvent) {};

    constructor($q: angular.IQService) {
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

        var localWs = this._ws;

        var timeout = setTimeout(() => {
            this._timedOut = true;
            localWs.close();
            this._timedOut = false;
        }, this.timeoutInterval);

        this._ws.onopen = (event: Event) => {
            clearTimeout(timeout);
            this.readyState = WebSocket.OPEN;
            reconnectAttempt = false;

            this._processRequests();
            this.onopen(event);
        };

        this._ws.onclose = (event: CloseEvent) => {
            clearTimeout(timeout);
            this._ws = null;
            if (this._forcedClose) {
                this.readyState = WebSocket.CLOSED;
                this.onclose(event);
            } else {
                this.readyState = WebSocket.CONNECTING;
                this.onconnecting();
                if (!reconnectAttempt && !this._timedOut) {
                    this.onclose(event);
                }
                setTimeout(() => {
                    this.connect(true, path);
                }, this.reconnectInterval);
            }
        };

        this._ws.onmessage = (event) => {
            const result = JSON.parse(event.data);
            const requestId = result['request-id'];
            const callback = _.find(this._callbacks, 'id', requestId);

            _.remove(this._callbacks, (cb) => cb.id === requestId);
            return callback.deffered.resolve(result);
        };

        this._ws.onerror = (event) => {
            this.onerror(event);
        };
    }

    public send(data: any): angular.IPromise<any> {
        const requestId = this._generateID();

        _.assign(data, {
            'request-id': requestId
        });

        const callback = {
            id: requestId,
            deffered: this._q.defer(),
            data: JSON.stringify(data)
        };

        this._callbacks.push(callback);

        if (this._ws && this._ws.readyState === WebSocket.OPEN) {
            this._processRequests();
            return callback.deffered.promise;
        }
    }

    private _processRequests(): void {
        if (!this._callbacks.length) {
            return;
        }

        for (let request of this._callbacks) {
            this._ws.send(request.data);
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
