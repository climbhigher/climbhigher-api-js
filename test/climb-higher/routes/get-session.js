"use strict";

var expect = require("chai").expect;

var helpers = require("../../helpers"),
    requiresAuthentication = helpers.requiresAuthentication,
    validAuth = helpers.validAuth,
    request = helpers.request,
    ClimbHigher = helpers.ClimbHigher;

describe("GET /sessions/:sessionId", function() {
    var response, postedObj, getObj;

    var newSession = {
        location: "CentralRock Watertown",
        date: (new Date()).toISOString()
    };

    before(function(done) {
        request({ method: "POST", uri: "/sessions", auth: validAuth, body: newSession })
            .spread(function(err, res, obj) {
                expect(res.statusCode).to.equal(201);
                expect(obj.id).to.exist;
                postedObj = obj;
            }).then(function() {
                expect(postedObj).to.exist;

                return request({
                    method: "GET",
                    uri: "/sessions/" + postedObj.id,
                    auth: validAuth
                });
            })
            .spread(function(err, res, obj) { response = res; getObj = obj; })
            .then(done).catch(done);
    });

    it("requires authentication", function(done) {
        requiresAuthentication("GET", "/sessions/" + postedObj.id)(done);
    });

    it("returns 401 Unauthorized if the session is not owned by the current user", function(done) {
        request({ method: "GET", uri: "/sessions/" + postedObj.id, auth: helpers.validAuth2 })
            .spread(helpers.expectForbiddenSession)
            .then(done).catch(done);
    });

    it("returns 200 OK if the authenticated user owns the session", function() {
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.contain("application/json");
    });

    it("returns the requested session object", function() {
        expect(getObj).to.exist;
        expect(getObj.id).to.exist;
        expect(getObj.location).to.exist;
        expect(getObj.date).to.exist;

        expect(getObj.id).to.equal(postedObj.id);
        expect(getObj.location).to.equal(postedObj.location);
        expect(getObj.date).to.equal(postedObj.date);
    });
});