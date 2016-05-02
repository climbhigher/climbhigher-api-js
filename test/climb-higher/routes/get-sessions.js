"use strict";

const _ = require("lodash");
const expect = require("chai").expect;

const helpers = require("../../helpers");
const request = helpers.request;
const requiresAuthentication = helpers.requiresAuthentication;

describe("GET /sessions", function () {
    var response, body;

    before((done) =>
        request({method: "GET", uri: "/sessions", auth: helpers.validAuth})
            .spread((err, res, _body) => {
                response = res;
                body = _body;
            })
            .then(done)
            .catch(done)
    );

    it("requires authentication", requiresAuthentication("GET", "/sessions"));

    it("returns 200 OK with content-type application/json", () => {
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.contain("application/json");
    });

    it("returns a list of the authenticated user's climbing sessions", () => {
        expect(body).to.exist;
        expect(_.isArray(body)).to.be.true;
    });
});
