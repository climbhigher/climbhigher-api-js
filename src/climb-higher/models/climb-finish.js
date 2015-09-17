"use strict";

var _ = require("lodash"),
    Sequelize = require('sequelize'),
    db = require('../database');

var PUBLIC_READ_FIELDS = ["name", "displayName"];

var ClimbFinish = module.exports = db.define('climb_finish', {
    name: { type: Sequelize.STRING, primaryKey: true },
    displayName: { type: Sequelize.STRING, primaryKey: true, field: "display_name" }
}, {
    underscored: true,
    timestamps: false,
    classMethods: {
        sanitize: function(obj) {
            return _.pick(obj, PUBLIC_READ_FIELDS);
        }
    },
    instanceMethods: {},
    getterMethods: {},
    setterMethods: {}
});
