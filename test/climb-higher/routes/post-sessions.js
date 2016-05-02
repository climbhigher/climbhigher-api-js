"use strict";

const expect = require("chai").expect;

const helpers = require("../../helpers");
const request = helpers.request;
const validAuth = helpers.validAuth;
const requiresAuthentication = helpers.requiresAuthentication;

describe("POST /sessions", () => {
    var response, body;

    const newSession = {
        location: "Brooklyn Boulders",
        date: (new Date()).toISOString()
    };

    before((done) =>
        request({method: "POST", uri: "/sessions", auth: validAuth, body: newSession})
            .spread((err, res, _body) => {
                response = res;
                body = _body;
            })
            .then(done)
            .catch(done));

    it("requires authentication", requiresAuthentication("POST", "/sessions"));

    it("returns 201 Created on success", () => {
        expect(response.statusCode).to.equal(201);
        expect(response.headers['content-type']).to.contain("application/json");
    });

    it("returns the new session object", () => {
        expect(body).to.exist;
        expect(body.id).to.exist;
        expect(body.location).to.equal(newSession.location);
        expect(body.date).to.equal(newSession.date);
    });
});
