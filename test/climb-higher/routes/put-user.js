"use strict";

var expect = require("chai").expect;

var helpers = require("../../helpers"),
    ClimbHigher = helpers.ClimbHigher,
    request = helpers.request,
    validAuth = helpers.validAuth,
    requiresAuthentication = helpers.requiresAuthentication;

describe("PUT /user", function() {
    var response, origUser, updatedUser;

    var newUser = { email: "put-user-test@test.com", password: "put-user-test" },
        newUserAuth = { username: "put-user-test@test.com", password: "put-user-test" },
        updateEmailBody = { email: "updated-put-user-test@test.com" };

    before(function(done) {
        request({ method: "POST", uri: "/users", body: newUser })
            .then(function() {
                return request({ method: "GET", uri: "/user", auth: newUserAuth });
            })
            .spread(function(err, res, body) { origUser = body; })
            .then(function() {
                return request({ method: "PUT", uri: "/user",
                    auth: newUserAuth, body: updateEmailBody });
            })
            .spread(function(err, res, body) { response = res; updatedUser = body; })
            .then(done).catch(done);
    });

    after(function(done) {
        ClimbHigher.models.User.findById(origUser.id)
            .then(function(user) { user.destroy({ force: true }); })
            .then(done).catch(done);
    });

    it("requires authentication", requiresAuthentication("PUT", "/user"));

    it("returns 200 OK for a valid update", function() {
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.contain("application/json");
    });

    it("returns the updated user object on success", function() {
        expect(updatedUser).to.exist;
        expect(updatedUser.id).to.equal(origUser.id);
        expect(updatedUser.email).to.equal(updateEmailBody.email);
    });
});
