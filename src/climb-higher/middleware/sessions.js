"use strict";

var _ = require('lodash'),
    error = require('./common').error,
    errors = require('../resources').error,
    logger = require('../logger'),
    Session = require("../models").Session;

var sessions = module.exports = {
    fetchById: function(req, res, next, sessionId) {
        logger.verbose("sessions.fetchById - looking up sessionId " + sessionId);

        Session.findById(sessionId)
            .then(function(session) {
                if (session) {
                    req.climbSession = session;
                    next();
                } else {
                    logger.warn("sessions.fetchById - sessionId " + sessionId + " returned null");
                    error(req, res, 401, errors.forbidden_session)();
                }
            }).catch(error(req, res, 401, errors.forbidden_session));
    },

    ensureOwner: function(req, res, next) {
        logger.verbose("sessions.ensureOwner - ensuring session "
            + (req.climbSession && req.climbSession.id)
            + " is owned by user " + (req.loginUser && req.loginUser.email));

        if (req.climbSession.isOwnedBy(req.loginUser)) {
            next();
        } else {
            error(req, res, 401, errors.forbidden_session)();
        }
    },

    list: function(req, res) {
        Session.findAllForUser(req.loginUser)
            .then(function(sessions) {
                res.status(200)
                    .send(_.map(sessions, function(s) {
                        return s.withLinks().sanitized();
                    }));
            })
            .catch(error(req, res, 500, errors.internal_error));
    },

    create: function(req, res) {
        var newSession = _.extend(Session.extract(req.body),
            { userId: req.loginUser.get('id') });

        Session.create(newSession)
            .then(function(session) {
                res.status(201)
                    .send(session.withLinks().sanitized());
            })
            .catch(error(req, res, 500, errors.internal_error));
    },

    show: function(req, res) {
        logger.verbose("sessions.show - showing session "
            + (req.climbSession && req.climbSession.id));

        res.status(200)
            .send(req.climbSession.withLinks().sanitized());
    },

    update: function(req, res) {
        req.climbSession.set(Session.extract(req.body));

        req.climbSession.save()
            .then(function(session) {
                res.status(200)
                    .send(session.withLinks().sanitized());
            })
            .catch(error(req, res, 500, errors.internal_error));
    },

    destroy: function(req, res) {
        req.climbSession.destroy()
            .then(function() { res.status(204).send(); })
            .catch(error(req, res, 500, errors.internal_error));
    }
};
