'use strict';

const api = require('./api/');
const ClimbHigherDB = require('./database');
const resources = require('./resources');
const logger = require('./logger');
const data = require('./data');

module.exports = {
    api: api,
    ClimbHigherDB: ClimbHigherDB,
    resources: resources,
    logger: logger,
    data: data
};
