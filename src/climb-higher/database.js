"use strict";

var Sequelize = require("sequelize"),
    config = require("./config"),
    logger = require("./logger");

var dbOptions = {
    dialect: "postgres",
    host: config.database.host,
    define: {
        paranoid: true,
        underscored: true,
        underscoredAll: true
    },
    logging: logger.debug,
    minConnections: 1,
    maxConnections: 5
};

logger.info("Connecting to database " + config.database.name + " on " +
    config.database.host);

module.exports = new Sequelize(config.database.name, config.database.user,
    config.database.password, dbOptions);
