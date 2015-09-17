"use strict";

var winston = require('winston');

winston.addColors({
    info: 'green',
    warn: 'yellow',
    error: 'red'
});

module.exports = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            colorize: true,
            timestamp: true,
            level: 'debug'
        }),
        // new (winston.transports.File)({
        // timestamp: true,
        // filename: config.get('logging.filename'),
        // level: 'debug'
        // })
    ]
});
