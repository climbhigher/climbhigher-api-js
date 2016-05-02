'use strict';

const _ = require('lodash');

const R = require('../../resources');
const logger = require('../../logger');

function SessionMiddleware(db, common) {
    this._Session = db.Session;
    this._common = common;
}

_.extend(SessionMiddleware.prototype, {
    forbiddenSessionError: function (req, res) {
        const body = this._common.errorBody(R.error.forbiddenSession);
        return res.status(R.status.unauthorized).send(body);
    },

    fetchById: function (req, res, next, sessionId) {
        this._Session.findById(sessionId)
            .then((session) => {
                if (session) {
                    req.climbSession = session;
                    return next();
                } else {
                    return this.forbiddenSessionError(req, res);
                }
            }).catch(() => this.forbiddenSessionError(req, res));
    },

    ensureOwner: function (req, res, next) {
        if (req.climbSession.isOwnedBy(req.loginUser)) {
            return next();
        } else {
            return this.forbiddenSessionError(req, res);
        }
    },

    list: function (req, res) {
        this._Session.findAllForUser(req.loginUser)
            .then((sessions) => {
                const allSessions = _.map(sessions, (s) => s.sanitized());
                res.status(200).send(allSessions);
            })
            .catch(() => this._common.internalError(req, res));
    },

    create: function (req, res) {
        const newSession = _.extend(this._Session.extract(req.body), {
            userId: req.loginUser.get('id')
        });

        this._Session.create(newSession)
            .then((session) => res.status(201).send(session.sanitized()))
            .catch(() => this._common.internalErrorreq, res);
    },

    show: function (req, res) {
        res.status(200).send(req.climbSession.sanitized());
    },

    update: function (req, res) {
        req.climbSession.set(this._Session.extract(req.body));

        req.climbSession.save()
            .then((session) => res.status(200).send(session.sanitized()))
            .catch(() => this._common.internalError(req, res));
    },

    destroy: function (req, res) {
        req.climbSession.destroy()
            .then(() =>  res.status(204).send())
            .catch(() => this._common.internalError(req, res));
    }
});

module.exports = SessionMiddleware;
