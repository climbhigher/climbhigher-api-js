"use strict";

const _ = require('lodash');
const expect = require("chai").expect;
const Promise = require("bluebird");
const request = require("request");

const ClimbHigher = require('../');
const error = ClimbHigher.resources.error;

const host = "localhost";
const port = 1234;

function buildExpectResponse(statusCode, message) {
    return (err, res, body) => {
        expect(res.statusCode).to.equal(statusCode);
        expect(res.headers['content-type']).to.contain("application/json");

        expect(body).to.exist;
        expect(body.message).to.exist;
        expect(body.message).to.equal(message);
    };
}

const helpers = {
    ClimbHigher: ClimbHigher,

    http: {host: host, port: port},

    validAuth: {username: "valid-user@test.com", password: "password"},

    validAuth2: {username: "valid-user-2@test.com", password: "password"},

    validUserInvalidPasswordAuth: {username: "valid-user@test.com", password: "wrong password"},

    invalidUserAuth: {username: "does-not-exist@test.com", password: "doesn't matter"},

    requestWithDefaults: request.defaults({
        baseUrl: ("http://" + host + ":" + port + "/"),
        json: true
    }),

    expectForbiddenSession: buildExpectResponse(401, error.forbiddenSession),

    expectInvalidCredentials: buildExpectResponse(401, error.invalidCredentials),

    expectAscentNotFound: buildExpectResponse(404, error.invalidAscent),

    request: function (options) {
        return new Promise(function (resolve, reject) {
            helpers.requestWithDefaults(options, function (err, res, obj) {
                if (err) {
                    reject([err, res, obj]);
                } else {
                    resolve([err, res, obj]);
                }
            });
        });
    },

    _missingAuthRequest: function (method, uri) {
        return () => helpers.request({
            method: method,
            uri: uri,
            auth: helpers.invalidUserAuth,
        });
    },

    _validUserInvalidPasswordRequest: function (method, uri) {
        return () => helpers.request({
            method: method,
            uri: uri,
            auth: helpers.validUserInvalidPasswordAuth
        });
    },

    _validAuthRequest: function (method, uri) {
        return () => helpers.request({
            method: method,
            uri: uri,
            auth: helpers.validAuth
        });
    },

    requiresAuthentication: function (method, uri, validAuth) {
        return (done) => {
            helpers.request({method: method, uri: uri, auth: undefined})
                .spread(helpers.expectInvalidCredentials)
                .then(helpers._missingAuthRequest(method, uri))
                .spread(helpers.expectInvalidCredentials)
                .then(helpers._validUserInvalidPasswordRequest(method, uri))
                .spread(helpers.expectInvalidCredentials)
                .then(helpers._validAuthRequest(method, uri))
                .spread((err, res, obj) => expect(res.statusCode).to.not.equal(401))
                .finally(done);
        }
    },

    createNewAscentData: function (sessionId) {
        return {
            sessionId: sessionId,
            style: _.sample(_.values(helpers.ClimbHigher.data.ClimbStyle)),
            grade: _.sample(_.values(helpers.ClimbHigher.data.ClimbGrade)),
            finish: _.sample(_.values(helpers.ClimbHigher.data.ClimbFinish))
        };
    }
};

module.exports = helpers;
