"use strict";

var passport = require("passport"),
    BasicStrategy = require("passport-http").BasicStrategy,
    res = require('../resources'),
    logger = require('../logger'),
    User = require('../models/user');

var strategies = {
    USER_PASSWORD_BY_HTTP: new BasicStrategy(function(email, password, done) {
        logger.verbose("authentication.basic_auth - user " + email + " password " + password);

        User.authenticate(email, password)
            .then(function(user) { done(null, user); })
            .catch(function(errorMsg) {
                done(null, false, { message: errorMsg })
            });
    })
};

module.exports = function(app) {
    passport.use(strategies.USER_PASSWORD_BY_HTTP);
    app.use(passport.initialize());
    return app;
}
