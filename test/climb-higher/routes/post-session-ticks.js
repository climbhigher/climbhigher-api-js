"use strict";

var expect = require("chai").expect;

var helpers = require("../../helpers"),
    request = helpers.request,
    validAuth = helpers.validAuth,
    requiresAuthentication = helpers.requiresAuthentication;

describe("POST /sessions/:sessionId/ticks", function() {
    var response, startupObj, sessionObj, tickObj;

    var newSession = {
            location: "RockSpot South Boston",
            date: (new Date()).toISOString()
        },
        newTick = null;

    var buildNewTick = function() {
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
            })
            .spread(function(err, res, body) { sessionObj = body; })
            .then(function() {
                newTick = buildNewTick();

                return request({
                    method: "POST",
                    uri: "/sessions/" + sessionObj.id + "/ticks",
                    auth: validAuth,
                    body: newTick
                });
            })
            .spread(function(err, res, body) { response = res; tickObj = body; })
            .then(done).catch(done);
    });

    it("requires authentication", function(done) {
        requiresAuthentication("POST", "/sessions/" + sessionObj.id + "/ticks")(done);
    });

    it("returns 201 Created on success", function() {
        expect(response.statusCode).to.equal(201);
        expect(response.headers['content-type']).to.contain("application/json");
    });

    it("returns the body of the created tick", function() {
        expect(tickObj).to.exist;
        expect(tickObj.id).to.exist;
        expect(tickObj.sessionId).to.equal(sessionObj.id);
        expect(tickObj.style).to.equal(newTick.style);
        expect(tickObj.grade).to.equal(newTick.grade);
        expect(tickObj.finish).to.equal(newTick.finish);
    })

    it("returns 401 Not Authorized if the session is not owned by the current user", function(done) {
        request({
            method: "POST",
            uri: "/sessions/" + sessionObj.id + "/ticks",
            body: newTick,
            auth: helpers.validAuth2
        }).spread(helpers.expectForbiddenSession)
        .then(done).catch(done);
    });

    it("returns 401 Not Authorized if the session id does not exist", function(done) {
        request({
            method: "POST",
            uri: "/sessions/00000000-0000-0000-0000-000000000000/ticks",
            body: newTick,
            auth: helpers.validAuth
        }).spread(helpers.expectForbiddenSession)
        .then(done).catch(done);
    });

    it("returns 400 Bad Request if the tick is invalid", function(done) {
        var badNewTick = buildNewTick();
        badNewTick.sessionId = undefined;

        request({
            method: "POST",
            uri: "/sessions/" + sessionObj.id + "/ticks",
            body: badNewTick,
            auth: helpers.validAuth
        }).spread(function(err, res, body) {
            expect(res.statusCode).to.equal(400);
            expect(response.headers['content-type']).to.contain("application/json");
        }).then(done).catch(done);
    });
});
