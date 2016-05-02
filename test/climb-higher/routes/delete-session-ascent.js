"use strict";

const expect = require("chai").expect;

const helpers = require("../../helpers");
const request = helpers.request;
const validAuth = helpers.validAuth;
const requiresAuthentication = helpers.requiresAuthentication;

const newSession = {
    location: "Inner Peaks",
    date: (new Date()).toISOString()
};

describe("DELETE /sessions/:sessionId/ascents/:ascentId", () => {
    var response, sessionObj, ascentObj, newAscent;

    before((done) =>
        request({method: "POST", uri: "/sessions", auth: validAuth, body: newSession})
            .spread((err, res, body) => sessionObj = body)
            .then(() => {
                newAscent = helpers.createNewAscentData(sessionObj.id);

                return request({
                    method: "POST",
                    uri: "/sessions/" + sessionObj.id + "/ascents",
                    auth: validAuth,
                    body: newAscent
                });
            }).spread((err, res, body) => {
                response = res;
                ascentObj = body;
            })
            .then(() => request({
                method: "DELETE",
                uri: "/sessions/" + sessionObj.id + "/ascents/" + ascentObj.id,
                auth: validAuth
            }))
            .spread((err, res, body) => response = res)
            .then(() => done())
            .catch(done));

    it("requires authentication", (done) => {
        const willDeleteAscent = helpers.createNewAscentData(sessionObj.id);

        request({
            method: "POST",
            uri: "/sessions/" + sessionObj.id + "/ascents",
            auth: validAuth,
            body: willDeleteAscent
        })
            .spread((err, res, body) => body)
            .then((ascent) => {
                const deleteAscentUrl = "/sessions/" + sessionObj.id + "/ascents/" + ascent.id;
                requiresAuthentication("DELETE", deleteAscentUrl)(done);
            });
    });

    it("returns 204 No Content on success", () => expect(response.statusCode).to.equal(204));

    it("returns 401 Not Authorized if the session id does not exist", (done) => {
        request({
            method: "DELETE",
            uri: "/sessions/00000000-0000-0000-0000-000000000000/ascents/" + ascentObj.id,
            auth: validAuth
        })
            .spread(helpers.expectForbiddenSession)
            .then(done)
            .catch(done);
    });

    it("returns 401 Not Authorized if the session is not owned by the currently authenticated user", (done) => {
        request({
            method: "POST",
            uri: "/sessions/" + sessionObj.id + "/ascents",
            auth: validAuth,
            body: helpers.createNewAscentData(sessionObj.id)
        })
            .spread((err, res, body) =>
                request({
                    method: "DELETE",
                    uri: "/sessions/" + sessionObj.id + "/ascents/" + body.id,
                    auth: helpers.validAuth2
                }))
            .spread(helpers.expectForbiddenSession)
            .then(done)
            .catch(done);
    });

    it("returns 404 Not Found if the session is valid and owned, but the ascent id does not exist", (done) => {
        request({
            method: "DELETE",
            uri: "/sessions/" + sessionObj.id + "/ascents/00000000-0000-0000-0000-000000000000",
            auth: helpers.validAuth
        })
            .spread(helpers.expectAscentNotFound)
            .then(done)
            .catch(done);
    });
});
