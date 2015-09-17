"use strict";

var fs = require("fs"),
    path = require("path"),
    logger = require("./logger");

var env = process.env["CH_ENV"] || "development",
    configDir = path.normalize(path.join(__dirname, "..", "..", "config")),
    configPath = path.join(configDir, env);

logger.info("Loading config for environment " + env + " from " + configPath);

if (fs.existsSync(configPath + ".js") || fs.existsSync(configPath + ".json")) {
    var config = require(configPath);
    module.exports = config;
} else {
    logger.error("No configuration defined for environment " + env);
    process.exit(1);
}
