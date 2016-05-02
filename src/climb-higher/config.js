'use strict';

const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const env = process.env['CH_ENV'] || 'development';
const configDir = path.normalize(path.join(__dirname, '..', '..', 'config'));
const configPath = path.join(configDir, env);

if (fs.existsSync(configPath + '.js') || fs.existsSync(configPath + '.json')) {
    logger.info('Loading config for environment ' + env + ' from ' + configPath);
    module.exports = require(configPath);
} else {
    logger.error('No configuration defined for environment ' + env);
    process.exit(1);
}
