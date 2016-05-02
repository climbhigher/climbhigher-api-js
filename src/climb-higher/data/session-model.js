'use strict';

const _ = require('lodash');
const Sequelize = require('sequelize');
const logger = require('../logger');

const SESSION_PUBLIC_READ_FIELDS = ['id', 'location', 'date', 'links'];
const SESSION_PUBLIC_WRITE_FIELDS = ['location', 'date'];
const SESSION_REQUIRED_CREATE_FIELDS = ['location', 'date'];

function createClimbingSession(db) {
    const Session = db.define('Session', {
        id: {type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4},
        userId: {type: Sequelize.UUID, allowNull: false, field: 'user_id', references: {model: 'users', key: 'id'}},
        location: {type: Sequelize.STRING, allowNull: false, defaultValue: ''},
        date: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW}
    }, {
        classMethods: {
            findAllForUser: function (user) {
                return Session.findAll({where: {user_id: user.get('id')}});
            },

            extract: function (obj) {
                return _.pick(obj, SESSION_PUBLIC_WRITE_FIELDS);
            },

            requiredFieldsExist: function (obj) {
                return _.every(SESSION_REQUIRED_CREATE_FIELDS,
                    (reqField) => _.has(obj, reqField));
            }
        },
        instanceMethods: {
            isOwnedBy: function (user) {
                if (!user) {
                    logger.warn('session.isOwnedBy - user is undefined or null');
                    return false;
                } else {
                    return user.get('id') === this.get('userId');
                }
            },
            
            sanitized: function () {
                return _.pick(this, SESSION_PUBLIC_READ_FIELDS);
            }
        },
        getterMethods: {},
        setterMethods: {}
    });

    return Session;
}

module.exports = createClimbingSession;
