"use strict";

const assert = require('assert');
const ClimbHigher = require('../..');

const db = new ClimbHigher.ClimbHigherDB();
const User = db.User;
const error = ClimbHigher.resources.error;


describe('User', function() {
    describe('.findByEmail()', function() {
        it('rejects if a user does not exist', function(done) {
            User.findByEmail("does-not-exist@test.com")
                .then(function() { assert(false); done("found non-existent user."); })
                .catch(function() { assert(true); done(); });
        });

        it('returns the user with that email', function(done) {
            const expectedEmail = "bostwick.d@gmail.com";

            User.findByEmail(expectedEmail)
                .then(function(user) {
                    assert(user);
                    assert(user.email === expectedEmail);
                    done();
                });
        });
    });

    describe(".authenticate", function() {
        it("rejects with invalidUser buildErrorHandler for an unknown user", function(done) {
            User.authenticate("invalid-user@test.com", "hello word")
                .then(function(user) { assert(false); done("accepted invalid user."); })
                .catch(function(err) { assert(err === error.invalidUser); done(); })
        });

        it("rejects with invalidPassword for a valid user but incorrect password", function(done) {
            User.authenticate("valid-user@test.com", "invalid")
                .then(function(user) { assert(false); done("accepted invalid password."); })
                .catch(function(err) { assert(err === error.invalidPassword); done(); })
        });

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
