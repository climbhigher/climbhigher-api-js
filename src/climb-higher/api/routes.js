"use strict";

var logger = require("../logger"),
    middleware = require('../middleware'),
    users = middleware.users,
    sessions = middleware.sessions,
    common = middleware.common,
    ticks = middleware.ticks;

function rootDirectory(req, res) {
    res.status(200)
        .send({
            "current_user_url": "/user",
            "current_user_sessions_url": "/sessions",
            "mobile_startup_url": "/startup"
        });
}

module.exports = function(app) {
    app.param("userId", users.fetchById);
    app.param("sessionId", sessions.fetchById);
    app.param("tickId", ticks.fetchById);

    app.get("/", rootDirectory);

    app.get("/clients/start", common.clientStartup);

    app.route("/user")
        .all(common.ensureAuthenticated)
        .get(users.showLoginUser)
        .put(users.update);

    app.route("/users")
        .post(users.create);

    app.route("/sessions")
        .all(common.ensureAuthenticated)
        .get(sessions.list)
        .post(sessions.create, sessions.show);

    app.route("/sessions/:sessionId")
        .all(common.ensureAuthenticated, sessions.ensureOwner)
        .get(sessions.show)
        .put(sessions.update)
        .delete(sessions.destroy);

    app.route("/sessions/:sessionId/ticks")
        .all(common.ensureAuthenticated, sessions.ensureOwner)
        .post(ticks.create);

    app.route("/sessions/:sessionId/ticks/:tickId")
        .all(common.ensureAuthenticated, sessions.ensureOwner)
        .delete(ticks.destroy);
}
