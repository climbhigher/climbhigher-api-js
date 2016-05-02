'use strict';

const winston = require('winston');
const Logger = winston.Logger;

winston.addColors({
    info: 'green',
    warn: 'yellow',
    buildErrorHandler: 'red'
});

module.exports = new Logger({
    transports: [
        new (winston.transports.Console)({
            colorize: true,
            timestamp: true,
            level: 'debug'
        })
        // new (winston.transports.File)({
        // timestamp: true,
        // filename: config.get('logging.filename'),
        // level: 'debug'
        // })
    ]
});
