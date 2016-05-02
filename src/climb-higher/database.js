'use strict';

const _ = require('underscore');
const Sequelize = require('sequelize');

const dbConfig = require('./config').database;
const logger = require('./logger');
const createUserModel = require('./data/user-model');
const createSessionModel = require('./data/session-model');
const createAscentModel = require('./data/ascent-model');

function ClimbHigherDB() {
    this._connect();
    this._initModels();
}

_.extend(ClimbHigherDB.prototype, {
    dbOptions: {
        dialect: 'postgres',
        host: dbConfig.host,
        define: {
            paranoid: true,
            underscored: true,
            underscoredAll: true
        },
        logging: logger.debug,
        minConnections: 1,
        maxConnections: 5
    },

    _connect: function () {
        logger.info('Connecting to database ' + dbConfig.name + ' on '
            + dbConfig.host);

        this._dbCon = new Sequelize(dbConfig.name, dbConfig.user,
            dbConfig.password, this.dbOptions);
    },

    User: null,
    Session: null,
    Ascent: null,

    _initModels: function() {
        this.User = createUserModel(this._dbCon);
        this.Session = createSessionModel(this._dbCon);
        this.Ascent = createAscentModel(this._dbCon);

        this.Session.belongsTo(this.User);
        this.Ascent.belongsTo(this.Session);
    }
});

module.exports = ClimbHigherDB;
