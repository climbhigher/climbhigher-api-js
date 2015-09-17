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

logger.info("Connection to database " + config.database.name + " on "
    + config.database.host + " with user " + config.database.user);

module.exports = new Sequelize(config.database.name, config.database.user,
    config.database.password, dbOptions);
