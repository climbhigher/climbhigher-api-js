'use strict';

const expect = require('chai').expect;
const http = require('http');

const helpers = require('../helpers');
const ClimbHigher = helpers.ClimbHigher;

ClimbHigher.logger.transports.console.level = 'error';

describe('ClimbHigher Api Routes', function () {
    var apiServer;

    before((done) => {
        apiServer = new ClimbHigher.api.ApiServer();
        apiServer.serve(helpers.http.port, done);
    });

    after(() => apiServer.close());

    it('is listening', () => expect(apiServer).to.exist);

    require('./routes/post-users');
    require('./routes/get-user');
    require('./routes/put-user');

    require('./routes/get-sessions');
    require('./routes/post-sessions');

    require('./routes/get-session');
    require('./routes/put-session');
    require('./routes/delete-session');

    require('./routes/post-session-ascents');
    require('./routes/delete-session-ascent');
});
