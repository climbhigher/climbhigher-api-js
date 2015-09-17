"use strict";

var errors = require("../resources").error,
    notImplemented = require("./common").notImplemented,
    error = require('./common').error,
    logger = require("../logger"),
    Tick = require("../models").Tick;

var ticks = module.exports = {
    fetchById: function(req, res, next, tickId) {
        Tick.findById(tickId)
            .then(function(tick) {
                if (tick) {
                    req.climbSessionTick = tick;
                    next();
                } else {
                    error(req, res, 404, errors.invalid_tick)();
                }
            }).catch(error(req, res, 404, errors.invalid_tick));
    },

    create: function(req, res) {
        var newTick = Tick.extract(req.body);

        logger.verbose("ticks.create - creating tick for session "
            + (newTick && newTick.sessionId));
        logger.verbose("ticks.create - " + JSON.stringify(newTick));

        Tick.create(newTick)
            .then(function(createdTick) {
                logger.verbose(Tick.sanitize(createdTick));
                res.status(201).send(Tick.sanitize(createdTick));
            }).catch(error(req, res, 400, errors.invalid_tick));
    },

    destroy: function(req, res) {
        req.climbSessionTick.destroy()
            .then(function() { res.status(204).send(); })
            .catch(error(req, res, 500, errors.internal_error));
    }
};
