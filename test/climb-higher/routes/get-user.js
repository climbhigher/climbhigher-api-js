"use strict";

var expect = require("chai").expect;

var helpers = require("../../helpers"),
    requiresAuthentication = helpers.requiresAuthentication,
    request = helpers.request;

describe("GET /user", function() {
    var response, body;

    before(function(done) {
        request({ method: "GET", uri: "/user", auth: helpers.validAuth })
            .spread(function(err, _res, _body) { response = _res; body = _body; })
            .then(done).catch(done);
    });

    it("requires authentication", requiresAuthentication("GET", "/user"));

    it("returns 200 OK with content-type application/json", function() {
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.contain("application/json");
    });

    it("returns the profile of the currently logged in user", function() {
        expect(body).to.exist;
        expect(body.id).to.exist;
        expect(body.email).to.exist;
    });
});
