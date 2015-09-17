"use strict";

var _ = require("lodash"),
    Sequelize = require('sequelize'),
    db = require('../database'),
    logger = require("../logger");

var SESSION_PUBLIC_READ_FIELDS = ["id", "location", "date", "links"],
    SESSION_PUBLIC_WRITE_FIELDS = ["location", "date"],
    SESSION_REQUIRED_CREATE_FIELDS = ["location", "date"];

var Session = module.exports = db.define('Session', {
    id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
    userId: { type: Sequelize.UUID, allowNull: false, field: "user_id", references: { model: "users", key: "id" } },
    location: { type: Sequelize.STRING, allowNull: false, defaultValue: "" },
    date: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
}, {
    classMethods: {
        findAllForUser: function(user) {
            return Session.findAll({ where: { user_id: user.get('id') }});
        },

        extract: function(obj) {
            return _.pick(obj, SESSION_PUBLIC_WRITE_FIELDS);
        },

        requiredFieldsExist: function(obj) {
            return _.every(SESSION_REQUIRED_CREATE_FIELDS, function(reqField) {
                _.has(obj, reqField);
            });
        }
    },
    instanceMethods: {
        isOwnedBy: function(user) {
            if (!user) {
                logger.warn("session.isOwnedBy - user is undefined or null");
                return false;
            } else {
                return user.get('id') === this.get('userId');
            }
        },

        withLinks: function() {
            this.set('links', {
                "session_url": ("/sessions" + this.get('id'))
            });

            return this;
        },

        sanitized: function() {
            return _.pick(this, SESSION_PUBLIC_READ_FIELDS);
        }
    },
    getterMethods: {},
    setterMethods: {},
});
