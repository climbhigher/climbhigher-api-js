"use strict";

var expect = require("chai").expect,
    Promise = require("bluebird"),
    request = require("request");

var ClimbHigher = require('../'),
    errors = ClimbHigher.resources.error;

var host = "localhost",
    port = 1234;

function buildExpectResponse(statusCode, message) {
    return function(err, res, body) {
        expect(res.statusCode).to.equal(statusCode);
        expect(res.headers['content-type']).to.contain("application/json");
        expect(body).to.exist;
        expect(body.message).to.exist;
        expect(body.message).to.equal(message);
    };
}

var expectInvalidCredentials = buildExpectResponse(401, errors.invalid_credentials),
    expectForbiddenSession = buildExpectResponse(401, errors.forbidden_session),
    expectTickNotFound = buildExpectResponse(404, errors.invalid_tick);

var helpers = module.exports = {
    ClimbHigher: ClimbHigher,

    http: { host: host, port: port },

    validAuth: { username: "valid-user@test.com", password: "password" },

    validAuth2: { username: "valid-user-2@test.com", password: "password" },

    validUserInvalidPasswordAuth: { username: "valid-user@test.com", password: "wrong password" },

    invalidUserAuth: { username: "does-not-exist@test.com", password: "doesn't matter" },

    requestWithDefaults: request.defaults({
        baseUrl: ("http://" + host + ":" + port + "/"),
        json: true
    }),

    expectForbiddenSession: expectForbiddenSession,

    expectInvalidCredentials: expectInvalidCredentials,

    expectTickNotFound: expectTickNotFound,

    request: function(options) {
        return new Promise(function(resolve, reject) {
            helpers.requestWithDefaults(options, function(err, res, obj) {
                if (err) {
                    reject([err, res, obj]);
                } else {
                    resolve([err, res, obj]);
                }
            });
        });
    },

    requiresAuthentication: function(method, uri, validAuth) {
        return function(done) {
            helpers.request({ method: method, uri: uri, auth: undefined })
                .spread(expectInvalidCredentials)
                .then(function() {
                    return helpers.request({
                        method: method,
                        uri: uri,
                        auth: helpers.invalidUserAuth,
                    });
                })
                .spread(expectInvalidCredentials)
                .then(function() {
                    return helpers.request({
                        method: method,
                        uri: uri,
                        auth: helpers.validUserInvalidPasswordAuth
                    });
                })
                .spread(expectInvalidCredentials)
                .then(function(){
                    return helpers.request({
                        method: method,
                        uri: uri,
                        auth: helpers.validAuth
                    });
                })
                .spread(function(err, res, obj) {
                    expect(res.statusCode).to.not.equal(401);
                })
                .finally(done);
        }
    }
};
