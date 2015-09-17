"use strict";

var expect = require("chai").expect;

var helpers = require("../../helpers"),
    request = helpers.request,
    validAuth = helpers.validAuth,
    requiresAuthentication = helpers.requiresAuthentication;

describe("POST /sessions", function() {
    var response, body;

    var newSession = {
        location: "Brooklyn Boulders",
        date: (new Date()).toISOString()
    };

    before(function(done) {
        request({ method: "POST", uri: "/sessions", auth: validAuth, body: newSession })
            .spread(function(err, res, _body) { response = res; body = _body; })
            .then(done).catch(done);
    });

    it("requires authentication", requiresAuthentication("POST", "/sessions"));

    it("returns 201 Created on success", function() {
        expect(response.statusCode).to.equal(201);
        expect(response.headers['content-type']).to.contain("application/json");
    });

    it("returns the new session object", function() {
        expect(body).to.exist;
        expect(body.id).to.exist;
        expect(body.location).to.equal(newSession.location);
        expect(body.date).to.equal(newSession.date);
    });
});
