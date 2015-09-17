"use strict";

var expect = require("chai").expect;

var helpers = require("../../helpers"),
    request = helpers.request,
    validAuth = helpers.validAuth,
    requiresAuthentication = helpers.requiresAuthentication;

describe("DELETE /sessions/:sessionId/ticks/:tickId", function() {
    var response, startupObj, sessionObj, tickObj;

    var newSession = {
            location: "Inner Peaks",
            date: (new Date()).toISOString()
        },
        newTick = null,
        buildNewTick = function() {
            return {
                sessionId: sessionObj.id,
                style: startupObj.climbing_styles[0].name,
                finish: startupObj.climbing_finishes[0].name,
                grade: startupObj.climbing_grades[0].value
            };
        };

    before(function(done) {
        request({ method: "GET", uri: "/clients/start" })
            .spread(function(err, res, body) { startupObj = body; })
            .then(function() {
                return request({
                    method: "POST",
                    uri: "/sessions",
                    auth: validAuth,
                    body: newSession
                });
            }).spread(function(err, res, body) {
                sessionObj = body;
            }).then(function() {
                newTick = buildNewTick();

                return request({
                    method: "POST",
                    uri: "/sessions/" + sessionObj.id + "/ticks",
                    auth: validAuth,
                    body: newTick
                });
            }).spread(function(err, res, body) {
                response = res; tickObj = body;
            }).then(function() {
                return request({
                    method: "DELETE",
                    uri: "/sessions/" + sessionObj.id + "/ticks/" + tickObj.id,
                    auth: validAuth
                });
            }).spread(function(err, res, body) {
                response = res;
            }).then(done).catch(done);
    });

    it("requires authentication", function(done) {
        request({
            method: "POST",
            uri: "/sessions/" + sessionObj.id + "/ticks",
            auth: validAuth,
            body: buildNewTick()
        }).spread(function(err, res, tick) {
            requiresAuthentication("DELETE",
                "/sessions/" + sessionObj.id + "/ticks/" + tick.id)(done);
        });
    });

    it("returns 204 No Content on success", function() {
        expect(response.statusCode).to.equal(204);
    });

    it("returns 401 Not Authorized if the session id does not exist", function(done) {
        request({
            method: "DELETE",
            uri: "/sessions/00000000-0000-0000-0000-000000000000/ticks/" + tickObj.id,
            auth: validAuth
        }).spread(helpers.expectForbiddenSession)
        .then(done).catch(done);
    });

    it("returns 401 Not Authorized if the session is not owned by the currently authenticated user", function(done) {
        request({
            method: "POST",
            uri: "/sessions/" + sessionObj.id + "/ticks",
            auth: validAuth,
            body: buildNewTick()
        }).spread(function(err, res, body) {
            return request({
                method: "DELETE",
                uri: "/sessions/" + sessionObj.id + "/ticks/" + body.id,
                auth: helpers.validAuth2
            });
        }).spread(helpers.expectForbiddenSession)
        .then(done).catch(done);
    });

    it("returns 404 Not Found if the session is valid and owned, but the tick id does not exist", function(done) {
        request({
            method: "DELETE",
            uri: "/sessions/" + sessionObj.id + "/ticks/00000000-0000-0000-0000-000000000000",
            auth: helpers.validAuth
        }).spread(helpers.expectTickNotFound)
        .then(done).catch(done);
    });
});
