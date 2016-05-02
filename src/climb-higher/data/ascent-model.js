'use strict';

const _ = require('lodash');
const Sequelize = require('sequelize');

const PUBLIC_WRITE_FIELDS = ['sessionId', 'style', 'grade', 'finish'];
const PUBLIC_READ_FIELDS = ['id', 'sessionId', 'style', 'grade', 'finish'];

function createAscentModel(db) {
    const Ascent = db.define('Ascent', {
        id: {type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4},
        sessionId: {
            type: Sequelize.UUID,
            allowNull: false,
            field: 'session_id',
            references: {model: 'sessions', key: 'id'}
        },
        style: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'climb_style'
        },
        grade: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'climb_grade'
        },
        finish: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'climb_finish'
        }
    }, {
        classMethods: {
            sanitize: function (obj) {
                return _.pick(obj, PUBLIC_READ_FIELDS);
            },

            extract: function (obj) {
                return _.pick(obj, PUBLIC_WRITE_FIELDS);
            },

            findAllForSession: function (session) {
                return Ascent.findAll({where: {session_id: session.get('id')}});
            }
        },
        instanceMethods: {},
        getterMethods: {},
        setterMethods: {}
    });

    return Ascent;
}

module.exports = createAscentModel;
