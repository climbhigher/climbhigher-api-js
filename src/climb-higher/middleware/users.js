"use strict";

var _ = require('lodash'),
    errors = require('../resources').error,
    logger = require('../logger'),
    error = require('./common').error,
    User = require('../models').User;

function userLinks(user) {
    return _.defaults(user, {
        links: {
            "user_profile_url": "/user",
            "user_sessions_url": "/sessions"
        }
    });
}

var users = module.exports = {
    fetchById: function(req, res, next, userId) {
        User.findById(userId)
            .then(function(user) { req.user = user; next(); })
            .catch(error(req, res, 404, errors.invalid_user));
    },

    showLoginUser: function(req, res) {
        res.status(200)
            .send(userLinks(User.sanitize(req.loginUser)));
    },

    update: function(req, res) {
        req.loginUser.set(User.extract(req.body));

        req.loginUser.save()
            .then(function(user) {
                res.status(200)
                    .send(userLinks(User.sanitize(req.loginUser)));
            });
    },

    create: function(req, res) {
        var newUser = User.extract(req.body);

        logger.info("users.create - creating new user " + newUser.email);

        User.create(newUser)
            .then(function(user) {
                res.status(201).send(User.sanitize(user));
            }).catch(error(req, res, 400, errors.invalid_user));
    }
};
