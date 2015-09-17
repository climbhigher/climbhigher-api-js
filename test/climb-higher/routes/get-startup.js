"use strict";

var _ = require("lodash"),
    expect = require("chai").expect;

var helpers = require("../../helpers"),
    request = helpers.request;

describe("GET /clients/start", function() {
    var response, body;

    before(function(done) {
        request({ method: "GET", uri: "/clients/start" })
            .spread(function(err, res, _body) { response = res; body = _body; })
            .then(done).catch(done);
    });

    it("returns 200 OK", function() {
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.contain("application/json");
    });

    it("returns an object with common, necessary data", function() {
        expect(body).to.exist;
        expect(body.climbing_finishes).to.exist;
        expect(_.isArray(body.climbing_finishes)).to.be.true;
        expect(body.climbing_styles).to.exist;
        expect(_.isArray(body.climbing_styles)).to.be.true;
        expect(body.climbing_grades).to.exist;
        expect(_.isArray(body.climbing_grades)).to.be.true;
    });
});
