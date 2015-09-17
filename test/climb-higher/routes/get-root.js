"use strict";

var expect = require("chai").expect;

var helpers = require("../../helpers"),
    request = helpers.request;

describe("GET /", function() {
    var response, body;

    before(function(done) {
        request({ method: "GET", uri: "/" })
            .spread(function(err, res, _body) { response = res; body = _body; })
            .then(done).catch(done);
    });

    it("returns 200 OK", function() {
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.contain("application/json");
    });

    it("returns a HATEOAS directory", function() {
        expect(body).to.exist;
        expect(body.current_user_url).to.exist;
        expect(body.current_user_sessions_url).to.exist;
    });
});
