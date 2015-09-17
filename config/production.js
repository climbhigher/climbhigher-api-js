"use strict";

var databaseUrl = process.env["DATABASE_URL"],  // Supplied by Heroku Postgres
    databaseRegex = /postgres:\/\/(.+)\:(.+)\@(.+)\/(.+)/,
    parts = databaseUrl.match(databaseRegex);

var config = module.exports = {
    database: {
        host: parts[3],
        name: parts[4],
        user: parts[1],
        password: parts[2]
    },

    api_port: process.env["PORT"]
};
