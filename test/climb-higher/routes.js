"use strict";

var expect = require("chai").expect,
    http = require("http");

var helpers = require("../helpers"),
    ClimbHigher = require('../../');

ClimbHigher.logger.transports.console.level = "error";

describe("ClimbHigher Api Routes", function() {
    var app, server;

    before(function(done) {
        app = ClimbHigher.api.create();
        server = http.createServer(app);
        server.listen(helpers.http.port, done);
    });

    after(function() { server.close(); });

    it("is listening", function() { expect(app).to.exist; });

    require("./routes/get-root");
    require("./routes/get-startup");

    require("./routes/post-users");

    require("./routes/get-user");
    require("./routes/put-user");

    require("./routes/get-sessions");
    require("./routes/post-sessions");

    require("./routes/get-session");
    require("./routes/put-session");
    require("./routes/delete-session");

    require("./routes/post-session-ticks");
    require("./routes/delete-session-tick");
});
