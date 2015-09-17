"use strict";

var _ = require("lodash"),
    Sequelize = require('sequelize'),
    db = require('../database');

var PUBLIC_WRITE_FIELDS = ["sessionId", "style", "grade", "finish"];
var PUBLIC_READ_FIELDS = ["id", "sessionId", "style", "grade", "finish"];

var Tick = module.exports = db.define('Tick', {
    id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
    sessionId: { type: Sequelize.UUID, allowNull: false, field: "session_id", references: { model: "sessions", key: "id" } },
    style: { type: Sequelize.STRING, allowNull: false, field: "climb_style_name", references: { model: "climb_styles", key: "name" } },
    grade: { type: Sequelize.STRING, allowNull: false, field: "climb_grade_value" },
    finish: { type: Sequelize.STRING, allowNull: false, field: "climb_finish_name", references: { model: "climb_finishes", key: "name" } },
}, {
    classMethods: {
        sanitize: function(tick) { return _.pick(tick, PUBLIC_READ_FIELDS); },

        extract: function(obj) { return _.pick(obj, PUBLIC_WRITE_FIELDS); },

        findAllForSession: function(session) {
            return Tick.findAll({ where: { session_id: session.get('id') }});
        }
    },
    instanceMethods: {},
    getterMethods: {},
    setterMethods: {},
});
