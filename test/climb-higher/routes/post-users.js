"use strict";

var expect = require("chai").expect;

var helpers = require("../../helpers"),
    request = helpers.request,
    ClimbHigher = require("../../../"),
    errors = ClimbHigher.resources.error;

describe("POST /users", function() {
    var response, body;

    var validNewUser = {
            "email": "new-user@test.com",
            "password": "my cool password"
        },
        invalidUserMissingPassword = {
            "email": "missing-password@test.com"
        },
        invalidUserMissingEmail = {
            "password": "dude, where's my email?"
        };

    before(function(done) {
        request({ method: "POST", uri: "/users", body: validNewUser })
            .spread(function(err, res, _body) { response = res; body = _body; })
            .then(done).catch(done);
    });

    after(function(done) {
        ClimbHigher.models.User.findById(body.id)
            .then(function(user) { user.destroy({ force: true }); })
            .then(done)
            .catch(done);
    });

    it("returns 201 Created for a valid User", function() {
        expect(response.statusCode).to.equal(201);
        expect(response.headers['content-type']).to.contain("application/json");
    });

    it("returns the new user's profile on success", function() {
        expect(body).to.exist;
        expect(body.id).to.exist;
        expect(body.email).to.equal(validNewUser.email);
        expect(body.apikey).to.exist;
    });

    it("returns 400 Bad Request for an invalid user object", function(done) {
        var assertInvalidUserError = function(err, res, obj) {
            expect(res.statusCode).to.equal(400);
            expect(res.headers['content-type']).to.contain("application/json");

            expect(obj).to.exist;
            expect(obj.message).to.exist;
            expect(obj.message).to.equal(errors.invalid_user);
        };

        request({ method: "POST", uri: "/users", body: undefined })
            .spread(assertInvalidUserError)
            .then(function() {
                return request({ method: "POST", uri: "/users", body: invalidUserMissingPassword })
            })
            .spread(assertInvalidUserError)
            .then(function() {
                return request({ method: "POST", uri: "/users", body: invalidUserMissingEmail })
            })
            .spread(assertInvalidUserError)
            .then(done).catch(done);
    });
});
