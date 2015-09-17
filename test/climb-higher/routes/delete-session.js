"use strict";

var expect = require("chai").expect;

var helpers = require("../../helpers"),
    request = helpers.request,
    validAuth = helpers.validAuth,
    requiresAuthentication = helpers.requiresAuthentication;

describe("DELETE /sessions/:sessionId", function() {
    var response, sessionObj;

    var newSession = {
        location: "Peak Experiences",
        date: (new Date()).toISOString()
    };

    before(function(done) {
        request({ method: "POST", uri: "/sessions", auth: validAuth, body: newSession })
            .spread(function(err, res, body) { sessionObj = body; })
            .then(function() {
                return request({
                    method: "DELETE",
                    uri: "/sessions/" + sessionObj.id,
                    auth: validAuth
                });
            })
            .spread(function(err, res, body) { response = res; })
            .then(done).catch(done);
    });

    it("requires authentication", function(done) {
        request({ method: "POST", uri: "/sessions", auth: validAuth, body: newSession })
            .spread(function(err, res, body) { return body; })
            .then(function(session) {
                return requiresAuthentication("DELETE", ("/sessions/" + session.id))(done);
            });
    });

    it("returns 204 No Content for a deleted session.", function() {
        expect(response.statusCode).to.equal(204);
    });

    it("returns 401 Not Authorized if the session id does not exist", function(done) {
        request({ method: "DELETE", uri: "/sessions/00000000-0000-0000-0000-000000000000", auth: validAuth })
            .spread(helpers.expectForbiddenSession)
            .then(done).catch(done);
    });

    it("returns 401 Not Authorized if the session is not owned by the current user", function(done) {
        request({ method: "POST", uri: "/sessions", auth: validAuth, body: newSession })
            .spread(function(err, res, body) {
                return request({
                    method: "DELETE",
                    uri: "/sessions/" + body.id,
                    auth: helpers.validAuth2
                });
            })
            .spread(helpers.expectForbiddenSession)
            .then(done).catch(done);
    });
});
