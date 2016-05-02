'use strict';

const _ = require('lodash');
const passport = require('passport');

const R = require('../../resources');
const logger = require('../../logger');


function CommonMiddleware() {
}

_.extend(CommonMiddleware.prototype, {
    buildErrorHandler: function (req, res, status, msg) {
        return (err) => {
            logger.warn(req.method + ' ' + req.route.path + ': ' + status + ' ' + msg +
                (err ? (' - ' + err) : ''));

            if (err) {
                res.status(status).send({message: msg, error: err});
            } else {
                res.status(status).send({message: msg});
            }
        };
    },

    errorBody: function (message, errMsg) {
        return {message: message, error: errMsg || undefined};
    },

    internalError: function (req, res, errMsg) {
        const body = this.errorBody(R.error.internalError, errMsg);
        return res.status(R.status.internalServerError).send(body);
    },

    unauthorizedError: function (req, res) {
        const body = this.errorBody(R.error.invalidCredentials);
        return res.status(R.status.unauthorized).send(body);
    },

    ensureAuthenticated: function (req, res, next) {
        const self = this;

        passport.authenticate('basic', (err, user) => {
            logger.verbose('common.ensureAuthenticated - user ' + JSON.stringify(user));

            if (err) {
                logger.warn('common.ensureAuthenticated - ' + err);
                return self.internalError(req, res, err);
            } else if (!user) {
                logger.warn('common.ensureAuthenticated - unknown user');
                return self.unauthorizedError(req, res);
            } else {
                req.loginUser = user;
                return next();
            }
        })(req, res, next);
    }
});

module.exports = CommonMiddleware;
