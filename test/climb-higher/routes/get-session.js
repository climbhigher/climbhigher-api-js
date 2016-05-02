"use strict";

const expect = require("chai").expect;

const helpers = require("../../helpers");
const requiresAuthentication = helpers.requiresAuthentication;
const validAuth = helpers.validAuth;
const request = helpers.request;

describe("GET /sessions/:sessionId", () => {
    var response, postedObj, getObj;

    const newSession = {
        location: "Central Rock Watertown",
        date: (new Date()).toISOString()
    };

    before((done) => {
        request({method: "POST", uri: "/sessions", auth: validAuth, body: newSession})
            .spread((err, res, obj) => {
                expect(res.statusCode).to.equal(201);
                expect(obj.id).to.exist;
                postedObj = obj;
            })
            .then(() => {
                expect(postedObj).to.exist;

                return request({
                    method: "GET",
                    uri: "/sessions/" + postedObj.id,
                    auth: validAuth
                });
            })
            .spread((err, res, obj) => {
                response = res;
                getObj = obj;
            })
            .then(done)
            .catch(done);
    });

    it("requires authentication", (done) =>
        requiresAuthentication("GET", "/sessions/" + postedObj.id)(done));

    it("returns 401 Unauthorized if the session is not owned by the current user", (done) =>
        request({method: "GET", uri: "/sessions/" + postedObj.id, auth: helpers.validAuth2})
            .spread(helpers.expectForbiddenSession)
            .then(done)
            .catch(done)
    );

    it("returns 200 OK if the authenticated user owns the session", () => {
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.contain("application/json");
    });

    it("returns the requested session object", () => {
        expect(getObj).to.exist;
        expect(getObj.id).to.exist;
        expect(getObj.location).to.exist;
        expect(getObj.date).to.exist;

        expect(getObj.id).to.equal(postedObj.id);
        expect(getObj.location).to.equal(postedObj.location);
        expect(getObj.date).to.equal(postedObj.date);
    });
});
