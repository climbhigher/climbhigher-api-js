"use strict";

var express = require("express"),
    bodyParser = require("body-parser"),
    Promise = require("bluebird"),
    logger = require("../logger"),
    config = require("../config");

Promise.longStackTraces();

var API = module.exports = {
    create: function() {
        var app = express();

        app.use(bodyParser.json({ strict: true }));

        require('./authentication')(app);
        require("./routes")(app);

        return app;
    },

    run: function(app, port) {
        port = port || config.api_port || 5000;

        app.listen(port, function() {
            logger.info("------------------------------");
            logger.info("Climb Higher API");
            logger.info("Listening on post " + port);
            logger.info("------------------------------");
        });
    },

    runServer: function() {
        API.run(API.create());
    }
};
