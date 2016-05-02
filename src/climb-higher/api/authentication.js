'use strict';

const _ = require('lodash');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const logger = require('../logger');

function createUserPasswordBasicAuth(User) {
    return new BasicStrategy((email, password, done) => {
        User.authenticate(email, password)
            .then((user) => done(null, user))
            .catch((errMsg) => done(null, false, {message: errMsg}))
    });
}

function Authentication(db) {
    this.strategies['HTTP_BASIC_AUTH'] = createUserPasswordBasicAuth(db.User);
}

_.extend(Authentication.prototype, {
    strategies: {},

    init: function () {
        passport.use(this.strategies.HTTP_BASIC_AUTH);
        return passport.initialize();
    }
});

module.exports = Authentication;
