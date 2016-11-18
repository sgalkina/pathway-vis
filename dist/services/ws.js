"use strict";
var ws = angular.module('pathwayvis.services.ws', []);
// WS url
exports.WS_ROOT_URL = 'ws://api.dd-decaf.eu/wsmodels/';
var WSService = (function () {
    function WSService($q) {
        this.reconnectInterval = 1000;
        this.timeoutInterval = 10000;
        this._forcedClose = false;
        this._timedOut = false;
        this.onopen = function (event) { };
        this.onclose = function (event) { };
        this.onconnecting = function () { };
        this.onmessage = function (event) { };
        this.onerror = function (event) { };
        this._callbacks = {};
        this._q = $q;
    }
    WSService.prototype._generateID = function () {
        return Math.random().toString(36).slice(2);
    };
    WSService.prototype.connect = function (reconnectAttempt, path) {
        var _this = this;
        this.readyState = WebSocket.CONNECTING;
        this._url = exports.WS_ROOT_URL + path;
        this._ws = new WebSocket(this._url);
        this.onconnecting();
        console.log('ReconnectingWebSocket', 'attempt-connect', this._url);
        var localWs = this._ws;
        var timeout = setTimeout(function () {
            console.log('ReconnectingWebSocket', 'connection-timeout', _this._url);
            _this._timedOut = true;
            localWs.close();
            _this._timedOut = false;
        }, this.timeoutInterval);
        this._ws.onopen = function (event) {
            clearTimeout(timeout);
            console.log('ReconnectingWebSocket', 'onopen', _this._url);
            _this.readyState = WebSocket.OPEN;
            reconnectAttempt = false;
            _this.onopen(event);
        };
        this._ws.onclose = function (event) {
            clearTimeout(timeout);
            _this._ws = null;
            if (_this._forcedClose) {
                _this.readyState = WebSocket.CLOSED;
                _this.onclose(event);
            }
            else {
                _this.readyState = WebSocket.CONNECTING;
                _this.onconnecting();
                if (!reconnectAttempt && !_this._timedOut) {
                    console.log('ReconnectingWebSocket', 'onclose', _this._url);
                    _this.onclose(event);
                }
                setTimeout(function () {
                    _this.connect(true, path);
                }, _this.reconnectInterval);
            }
        };
        this._ws.onmessage = function (event) {
            var result = JSON.parse(event.data);
            return _this._callbacks[_this._requestID].resolve(result);
        };
        this._ws.onerror = function (event) {
            console.log('ReconnectingWebSocket', 'onerror', _this._url, event);
            _this.onerror(event);
        };
    };
    WSService.prototype.send = function (data) {
        this._requestID = this._generateID();
        this._callbacks[this._requestID] = this._q.defer();
        if (this._ws) {
            this._ws.send(JSON.stringify(data));
            return this._callbacks[this._requestID].promise;
        }
        else {
            throw 'INVALID_STATE_ERR : Pausing to reconnect websocket';
        }
    };
    /**
     * Returns boolean, whether websocket was FORCEFULLY closed.
     */
    WSService.prototype.close = function () {
        if (this._ws) {
            this._forcedClose = true;
            this._ws.close();
            return true;
        }
        return false;
    };
    /**
     * Additional public API method to refresh the connection if still open
     * (close, re-open). For example, if the app suspects bad data / missed
     * heart beats, it can try to refresh.
     *
     * Returns boolean, whether websocket was closed.
     */
    WSService.prototype.refresh = function () {
        if (this._ws) {
            this._ws.close();
            return true;
        }
        return false;
    };
    return WSService;
}());
exports.WSService = WSService;
ws.service('ws', WSService);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ws;

//# sourceMappingURL=ws.js.map
