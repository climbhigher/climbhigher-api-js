"use strict";

const databaseUrl = process.env["DATABASE_URL"];  // Supplied by Heroku Postgres
const databaseRegex = /postgres:\/\/(.+)\:(.+)\@(.+)\:.+\/(.+)/;
const parts = databaseUrl.match(databaseRegex);

module.exports = {
    database: {
        host: parts[3],
        name: parts[4],
        user: parts[1],
        password: parts[2]
    },

    api_port: process.env["PORT"]
};
