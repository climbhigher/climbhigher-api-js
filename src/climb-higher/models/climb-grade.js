"use strict";

var _ = require("lodash"),
    Sequelize = require('sequelize'),
    db = require('../database');

var PUBLIC_READ_FIELDS = ["id", "value", "climbStyleName"];

var ClimbGrade = module.exports = db.define('climb_grade', {
    id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
    value: { type: Sequelize.STRING, primaryKey: true },
    climbStyleName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: "climb_style_name",
        references: { model: "climb_styles", key: "name" }
    }
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
    setterMethods: {},
});
