'use strict';

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const Promise = require('bluebird');
const http = require('http');

const logger = require('../logger');
const config = require('../config');
const createRoutes = require('./routes');
const Authentication = require('./authentication');
const ClimbHigherDB = require('../database');

function ApiServer() {
    this._app = express();

    this._db = new ClimbHigherDB();
    this._initApp();
}

_.extend(ApiServer.prototype, {
    _initApp: function () {
        this._app.set('port', this._normalizePort(config.api_port || 5000));

        this._app.use(bodyParser.json({strict: true}));
        this._app.use(new Authentication(this._db).init());
        this._app.use('/', createRoutes(this._db));
    },

    _server: null,

    serve: function (port, callback) {
        Promise.longStackTraces();

        this._server = http.createServer(this._app);
        this._server.listen(port || this._app.get('port'));
        this._server.on('listening', callback || this._onListening.bind(this));
    },

    close: function() {
        this._server.close();
    },

    _onListening: function () {
        logger.info('------------------------------');
        logger.info('Climb Higher API');
        logger.info('Listening on post ' + this._app.get('port'));
        logger.info('------------------------------');
    },

    _normalizePort: function (val) {
        const port = parseInt(val, 10)

        if (isNaN(port)) {
            return val; // Named pipe
        } else if (port >= 0) {
            return port; // Port number
        } else {
            return false;
        }
    }
});

module.exports = ApiServer;
