"use strict";

const expect = require("chai").expect;

const helpers = require("../../helpers");
const request = helpers.request;
const validAuth = helpers.validAuth;
const requiresAuthentication = helpers.requiresAuthentication;

const newSession = {
    location: "RockSpot South Boston",
    date: (new Date()).toISOString()
};

const createSessionRequest = function (newSession) {
    return {
        method: "POST",
        uri: "/sessions",
        auth: validAuth,
        body: newSession
    };
};

const createSessionAscentRequest = function (sessionObj, ascentObj) {
    return {
        method: "POST",
        uri: "/sessions/" + sessionObj.id + "/ascents",
        auth: validAuth,
        body: ascentObj
    };
};

describe("POST /sessions/:sessionId/ascents", () => {
    var response, sessionObj, ascentObj, newAscent;

    before((done) =>
        request(createSessionRequest(newSession))
            .spread((err, res, body) => sessionObj = body)
            .then(() => {
                newAscent = helpers.createNewAscentData(sessionObj.id);
                return request(createSessionAscentRequest(sessionObj, newAscent));
            }).spread((err, res, body) => {
                response = res;
                ascentObj = body;
            })
            .then(done)
            .catch(done));

    it("requires authentication", (done) =>
        requiresAuthentication("POST", "/sessions/" + sessionObj.id + "/ascents")(done));

    it("returns 201 Created on success", () => {
        expect(response.statusCode).to.equal(201);
        expect(response.headers['content-type']).to.contain("application/json");
    });

    it("returns the body of the created ascent", () => {
        expect(ascentObj).to.exist;
        expect(ascentObj.id).to.exist;
        expect(ascentObj.sessionId).to.equal(sessionObj.id);
        expect(ascentObj.style).to.equal(newAscent.style);
        expect(ascentObj.grade).to.equal(newAscent.grade);
        expect(ascentObj.finish).to.equal(newAscent.finish);
    });

    it("returns 401 Not Authorized if the session is not owned by the current user", (done) =>
        request({
            method: "POST",
            uri: "/sessions/" + sessionObj.id + "/ascents",
            body: newAscent,
            auth: helpers.validAuth2
        })
            .spread(helpers.expectForbiddenSession)
            .then(done)
            .catch(done));

    it("returns 401 Not Authorized if the session id does not exist", (done) =>
        request({
            method: "POST",
            uri: "/sessions/00000000-0000-0000-0000-000000000000/ascents",
            body: newAscent,
            auth: helpers.validAuth
        })
            .spread(helpers.expectForbiddenSession)
            .then(done)
            .catch(done));

    it("returns 400 Bad Request if the ascent is invalid", (done) => {
        const badNewTick = helpers.createNewAscentData(sessionObj.id);
        badNewTick.sessionId = undefined;

        request(createSessionAscentRequest(sessionObj, badNewTick))
            .spread((err, res, body) => {
                expect(res.statusCode).to.equal(400);
                expect(response.headers['content-type']).to.contain("application/json");
            })
            .then(done)
            .catch(done);
    });
});
