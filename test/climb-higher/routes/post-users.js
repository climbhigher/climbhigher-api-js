'use strict';

const expect = require('chai').expect;

const helpers = require('../../helpers');
const request = helpers.request;
const R = helpers.ClimbHigher.resources;

const validNewUser = {
    'name': 'New User',
    'email': 'new-user@test.com',
    'password': 'my cool password'
};
const invalidUserMissingPassword = {
    'name': 'Missing Password User',
    'email': 'missing-password@test.com'
};
const invalidUserMissingEmail = {
    'name': 'Missing Email User',
    'password': 'dude, where\'s my email?'
};

describe('POST /users', function () {
    var response, body;

    before((done) =>
        request({method: 'POST', uri: '/users', body: validNewUser})
            .spread(function (err, res, _body) {
                response = res;
                body = _body;
            })
            .then(done)
            .catch(done));

    after((done) =>
        request({
            method: 'DELETE',
            uri: '/user',
            auth: {username: validNewUser.email, password: validNewUser.password}
        })
            .then(() => done())
            .catch(done));

    it('returns 201 Created for a valid User', () => {
        expect(response.statusCode).to.equal(201);
        expect(response.headers['content-type']).to.contain('application/json');
    });

    it('returns the new user\'s profile on success', () => {
        expect(body).to.exist;
        expect(body.id).to.exist;
        expect(body.name).to.equal(validNewUser.name);
        expect(body.email).to.equal(validNewUser.email);
        expect(body.location).to.equal('');
        expect(body.password).to.not.exist;
    });

    it('returns 400 Bad Request for an invalid user object', (done) => {
        const assertInvalidUserError = function (err, res, obj) {
            expect(res.statusCode).to.equal(R.status.badRequest);
            expect(res.headers['content-type']).to.contain('application/json');

            expect(obj).to.exist;
            expect(obj.message).to.exist;
            expect(obj.message).to.equal(R.error.invalidUser);
        };

        request({method: 'POST', uri: '/users', body: undefined})
            .spread(assertInvalidUserError)
            .then(() => request({method: 'POST', uri: '/users', body: invalidUserMissingPassword}))
            .spread(assertInvalidUserError)
            .then(() => request({method: 'POST', uri: '/users', body: invalidUserMissingEmail}))
            .spread(assertInvalidUserError)
            .then(done)
            .catch(done);
    });
});
