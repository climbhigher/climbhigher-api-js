"use strict";

var _ = require("lodash"),
    passport = require("passport"),
    Promise = require("bluebird");

var errors = require("../resources").error,
    logger = require("../logger"),
    models = require("../models"),
    ClimbFinish = models.ClimbFinish,
    ClimbGrade = models.ClimbGrade,
    ClimbStyle = models.ClimbStyle;

var common = module.exports = {
    logRoute: function(req, res, next) {
        logger.verbose(req.method + " " + req.route.path);
        logger.verbose(req.body);
        next();
    },

    notImplemented: function(req, res) {
        common.error(req, res, 500, errors.not_implemented)();
    },

    // TODO: Rename to buildErrorResponse
    error: function(req, res, status, msg) {
        return function(err) {
            logger.warn(req.method + " " + req.route.path + ": " + status + " " + msg +
                (err ? (" - " + err) : ""));

            if (err) {
                res.status(status).send({ message: msg, error: err });
            } else {
                res.status(status).send({ message: msg });
            }
        };
    },

    ensureAuthenticated: function(req, res, next) {
        passport.authenticate('basic', function(err, user, info) {
            logger.verbose("common.ensureAuthenticated - authenticated user "
                + (user && user.email));

            if (err) {
                return common.error(req, res, 500, errors.internal_error)(err);
            } else if (!user) {
                return common.error(req, res, 401, errors.invalid_credentials)("no user found");
            } else {
                req.loginUser = user;
                return next();
            }
        })(req, res, next);
    },

    clientStartup: function(req, res) {
        Promise.join(ClimbFinish.all(), ClimbGrade.all(), ClimbStyle.all(),
            function(finishes, grades, styles) {
                return {
                    climbing_finishes: _.map(finishes, ClimbFinish.sanitize),
                    climbing_grades: _.map(grades, ClimbGrade.sanitize),
                    climbing_styles: _.map(styles, ClimbStyle.sanitize)
                };
            })
        .then(function(resBody) { res.status(200).send(resBody); })
        .catch(common.error(req, res, 500, errors.internal_error));
    }
};
