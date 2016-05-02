'use strict';

const _ = require('lodash');

const R = require('../../resources');
const logger = require('../../logger');

function UserMiddleware(db, common) {
    this._User = db.User;
    this._common = common;
}

_.extend(UserMiddleware.prototype, {
    invalidUserError: function (req, res) {
        const body = this._common.errorBody(R.error.invalidUser);
        return res.status(R.status.badRequest).send(body);
    },

    fetchById: function (req, res, next, userId) {
        this._User.findById(userId)
            .then((user) => {
                req.user = user;
                return next();
            })
            .catch(() => this.invalidUserError(req, res));
    },

    showLoginUser: function (req, res) {
        res.status(200).send(this._User.sanitize(req.loginUser));
    },

    deleteLoginUser: function (req, res) {
        req.loginUser.destroy()
            .then(() => res.status(R.status.noContent).send())
            .catch((err) => {
                logger.warn('users.destroyLoginUser - ' + err);
                this._common.internalError(req, res, err);
            });
    },

    update: function (req, res) {
        req.loginUser.set(this._User.extract(req.body));

        req.loginUser.save()
            .then((user) => res.status(R.status.ok).send(this._User.sanitize(user)))
            .catch((err) => {
                logger.warn('users.update - caught ' + err);
                return this._common.internalError(req, res);
            });
    },

    create: function (req, res) {
        const newUser = this._User.extract(req.body);
        logger.info('users.create - creating new user ' + JSON.stringify(newUser));

        this._User.create(newUser)
            .then((user) => {
                logger.debug('users.create - created new user: ' + user.get('email'));
                res.status(R.status.created).send(this._User.sanitize(user))
            })
            .catch((err) => {
                logger.warn('users.create - caught ' + err);
                return this.invalidUserError(req, res);
            });
    }
});

module.exports = UserMiddleware;
