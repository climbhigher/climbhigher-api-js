"use strict";

const expect = require("chai").expect;

const helpers = require("../../helpers");
const request = helpers.request;
const validAuth = helpers.validAuth;
const requiresAuthentication = helpers.requiresAuthentication;

describe("PUT /sessions/:sessionId", () => {
    var response, origObj, updatedObj;

    const newSession = {
        location: "Brooklyn Boulders",
        date: new Date().toISOString()
    };
    const updatedSession = {
        location: "MetroRock Everett"
    };

    before((done) =>
        request({method: "POST", uri: "/sessions", auth: validAuth, body: newSession})
            .spread(function (err, res, obj) {
                expect(res.statusCode).to.equal(201);
                origObj = obj;
            })
            .then(function () {
                return request({
                    method: "PUT",
                    uri: "/sessions/" + origObj.id,
                    auth: validAuth,
                    body: updatedSession
                });
            })
            .spread(function (err, res, obj) {
                response = res;
                updatedObj = obj;
            })
            .then(done)
            .catch(done));

    it("requires authentication", (done) => {
        requiresAuthentication("PUT", "/sessions/" + origObj.id)(done);
    });

    it("returns 401 Not Authorized if the session is not owned by the auth user", (done) =>
        request({method: "PUT", uri: "/sessions/" + origObj.id, body: newSession, auth: helpers.validAuth2})
            .spread(helpers.expectForbiddenSession)
            .then(done)
            .catch(done));

    it("returns 200 OK for a valid session update", () => {
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.contain("application/json");
    });

    it("returns the updated session object", () => {
        expect(updatedObj).to.exist;
        expect(updatedObj.id).to.exist;
        expect(updatedObj.id).to.equal(origObj.id);
        expect(updatedObj.location).to.equal(updatedSession.location);
        expect(updatedObj.date).to.equal(newSession.date);
    });
});
