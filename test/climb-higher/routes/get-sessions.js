"use strict";

var _ = require("lodash"),
    expect = require("chai").expect;

var helpers = require("../../helpers"),
    request = helpers.request,
    requiresAuthentication = helpers.requiresAuthentication;

describe("GET /sessions", function() {
    var response, body;

    before(function(done) {
        request({ method: "GET", uri: "/sessions", auth: helpers.validAuth })
            .spread(function(err, res, _body) { response = res; body = _body; })
            .then(done).catch(done);
    });

    it("requires authentication", requiresAuthentication("GET", "/sessions"));

    it("returns 200 OK with content-type application/json", function() {
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.contain("application/json");
    });

    it("returns a list of the authenticated user's climbing sessions", function() {
        expect(body).to.exist;
        expect(_.isArray(body)).to.be.true;
    });
});
