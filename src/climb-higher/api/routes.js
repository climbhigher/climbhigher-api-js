'use strict';

const _ = require('lodash');
const express = require('express');
const middleware = require('./middleware');

function createRoutes(db) {
    const common = _.bindAll(new middleware.Common());
    const users = _.bindAll(new middleware.Users(db, common));
    const sessions = _.bindAll(new middleware.Sessions(db, common));
    const ascents = _.bindAll(new middleware.Ascents(db, common));

    const router = express.Router();

    router.param('userId', users.fetchById);
    router.param('sessionId', sessions.fetchById);
    router.param('ascentId', ascents.fetchById);

    router.route('/user')
        .all(common.ensureAuthenticated)
        .get(users.showLoginUser)
        .put(users.update)
        .delete(users.deleteLoginUser);

    router.route('/users')
        .post(users.create);

    router.route('/sessions')
        .all(common.ensureAuthenticated)
        .get(sessions.list)
        .post(sessions.create, sessions.show);

    router.route('/sessions/:sessionId')
        .all(common.ensureAuthenticated, sessions.ensureOwner)
        .get(sessions.show)
        .put(sessions.update)
        .delete(sessions.destroy);

    router.route('/sessions/:sessionId/ascents')
        .all(common.ensureAuthenticated, sessions.ensureOwner)
        .post(ascents.create);

    router.route('/sessions/:sessionId/ascents/:ascentId')
        .all(common.ensureAuthenticated, sessions.ensureOwner)
        .delete(ascents.destroy);

    return router;
}

module.exports = createRoutes;
