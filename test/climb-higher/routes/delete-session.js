'use strict';

const expect = require("chai").expect;

const helpers = require("../../helpers");
const request = helpers.request;
const validAuth = helpers.validAuth;
const requiresAuthentication = helpers.requiresAuthentication;

const newSession = {
    location: "Peak Experiences",
    date: (new Date()).toISOString()
};

describe("DELETE /sessions/:sessionId", () => {
    var response, sessionObj;

    before((done) => {
        request({method: "POST", uri: "/sessions", auth: validAuth, body: newSession})
            .spread((err, res, body) => sessionObj = body)
            .then(() => request({
                method: "DELETE",
                uri: "/sessions/" + sessionObj.id,
                auth: validAuth
            }))
            .spread((err, res, body) => response = res)
            .then(() => done());
    });

    it("requires authentication", (done) =>
        request({method: "POST", uri: "/sessions", auth: validAuth, body: newSession})
            .spread((err, res, body) => body)
            .then((session) => requiresAuthentication("DELETE", ("/sessions/" + session.id))(done)));

    it("returns 204 No Content for a deleted session.", () =>
        expect(response.statusCode).to.equal(204));

    it("returns 401 Not Authorized if the session id does not exist", (done) =>
        request({method: "DELETE", uri: "/sessions/00000000-0000-0000-0000-000000000000", auth: validAuth})
            .spread(helpers.expectForbiddenSession)
            .then(done)
            .catch(done));

    it("returns 401 Not Authorized if the session is not owned by the current user", (done) =>
        request({method: "POST", uri: "/sessions", auth: validAuth, body: newSession})
            .spread((err, res, body) => request({
                method: "DELETE",
                uri: "/sessions/" + body.id,
                auth: helpers.validAuth2
            }))
            .spread(helpers.expectForbiddenSession)
            .then(done)
            .catch(done));
});
