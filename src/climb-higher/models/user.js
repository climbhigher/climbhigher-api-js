"use strict";

var _ = require("lodash"),
    Promise = require('bluebird'),
    bcrypt = require('bcrypt'),
    Sequelize = require('sequelize'),
    db = require('../database'),
    logger = require('../logger'),
    errors = require('../resources').error;

var REQUIRED_CREATE_FIELDS = ["email", "password"];
var PUBLIC_WRITE_FIELDS = ["email", "password"];
var PUBLIC_READ_FIELDS = ["id", "email", "apikey"];

var User = module.exports = db.define('User', {
	id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
	email: { type: Sequelize.STRING, allowNull: false, unique: true,
        validate: { isEmail: true, notEmpty: true } },
	passwordSalt: { type: Sequelize.STRING, allowNull: false, field: "password_salt" },
	passwordHash: { type: Sequelize.STRING, allowNull: false, field: "password_hash" },
    apikey: { type: Sequelize.UUID, allowNull: false, defaultValue: Sequelize.UUIDV4 }
}, {
	classMethods: {
		findByEmail: function(email) {
            return User.find({ where: { email: email }});
        },

        apiAuthenticate: function(id, apikey) {
            return User.find(id)
                .then(function(user) {
                    return new Promise(function(accept, reject) {
                        if (!user) { reject(errors.invalid_user); }
                        else if (user.apikey !== apikey) { reject(errors.invalid_apikey); }
                        else { accept(user); }
                    });
                })
        },

        extract: function(obj) {
            return _.pick(obj, PUBLIC_WRITE_FIELDS);
        },

        sanitize: function(user) {
            return _.pick(user, PUBLIC_READ_FIELDS);
        },

        createFieldsExist: function(obj) {
            return _.every(REQUIRED_CREATE_FIELDS, function(field) {
                _.has(obj, field);
            });
        },

		authenticate: function(email, password) {
			return User.findByEmail(email)
                .then(function(user) {
                    return new Promise(function(accept, reject) {
                        if (!user) { reject(errors.invalid_user); }
                        else if (user.comparePassword(password)) { accept(user); }
                        else { reject(errors.invalid_password); }
                    });
                });
		}
	},
    instanceMethods: {
        comparePassword: function(plaintext) {
            return bcrypt.compareSync(plaintext, this.passwordHash);
        }
    },
    getterMethods: {},
    setterMethods: {
        password: function(plaintext) {
            var salt = bcrypt.genSaltSync(10),
                hash = bcrypt.hashSync(plaintext, salt);

            this.setDataValue('passwordSalt', salt);
            this.setDataValue('passwordHash', hash);

            return this;
        }
    },
});
