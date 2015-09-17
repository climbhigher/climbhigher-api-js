"use strict";

var assert = require('assert'),
    ClimbHigher = require('../..'),
    User = ClimbHigher.models.User,
    errors = ClimbHigher.resources.error,
    logger = ClimbHigher.logger;

logger.transports.console.level = "info";

describe('User', function() {
    describe('.findByEmail()', function() {
        it('rejects if a user does not exist', function(done) {
            User.findByEmail("does-not-exist@test.com")
                .then(function() { assert(false); done("found non-existent user."); })
                .catch(function() { assert(true); done(); });
        });

        it('returns the user with that email', function(done) {
            var expectedEmail = "bostwick.d@gmail.com";

            User.findByEmail(expectedEmail)
                .then(function(user) {
                    assert(user);
                    assert(user.email === expectedEmail);
                    done();
                });
        });
    });

    describe(".authenticate", function() {
        it("rejects with invalid_user error for an unknown user", function(done) {
            User.authenticate("invalid-user@test.com", "hello word")
                .then(function(user) { assert(false); done("accepted invalid user."); })
                .catch(function(err) { assert(err === errors.invalid_user); done(); })
        });

        it("rejects with invalid_password for a valid user but incorrect password", function(done) {
            User.authenticate("valid-user@test.com", "invalid")
                .then(function(user) { assert(false); done("accepted invalid password."); })
                .catch(function(err) { assert(err === errors.invalid_password); done(); })
        })

        it("accepts and passes user for a valid email and password", function(done) {
            User.authenticate("valid-user@test.com", "password")
                .then(function(user) {
                    assert(user);
                    assert(user.email === "valid-user@test.com");
                    done();
                })
                .catch(done);
        });
    });
});
