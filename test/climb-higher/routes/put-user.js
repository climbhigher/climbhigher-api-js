"use strict";

const expect = require("chai").expect;

const helpers = require("../../helpers");
const ClimbHigher = helpers.ClimbHigher;
const request = helpers.request;
const requiresAuthentication = helpers.requiresAuthentication;

describe("PUT /user", function () {
    var response, origUser, updatedUser;

    const newUser = {
        name: 'Put User Test',
        email: "put-user-test@test.com",
        password: "put-user-test"
    };
    const newUserAuth = {
        username: "put-user-test@test.com",
        password: "put-user-test"
    };
    const updateEmailBody = {
        email: "updated-put-user-test@test.com"
    };

    before((done) => {
        request({method: "POST", uri: "/users", body: newUser})
            .then(() => request({method: "GET", uri: "/user", auth: newUserAuth}))
            .spread((err, res, body) => origUser = body)
            .then(() => request({
                method: "PUT",
                uri: "/user",
                auth: newUserAuth,
                body: updateEmailBody
            }))
            .spread((err, res, body) => {
                response = res;
                updatedUser = body;
            })
            .then(done)
            .catch(done);
    });

    after((done) => {
        request({method: 'DELETE', uri: '/user', auth: newUserAuth})
            .then(() => done())
            .catch(done);
    });

    it("requires authentication", requiresAuthentication("PUT", "/user"));

    it("returns 200 OK for a valid update", () => {
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.contain("application/json");
    });

    it("returns the updated user object on success", () => {
        expect(updatedUser).to.exist;
        expect(updatedUser.id).to.equal(origUser.id);
        expect(updatedUser.email).to.equal(updateEmailBody.email);
    });
});
