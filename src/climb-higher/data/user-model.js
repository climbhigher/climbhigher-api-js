'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const logger = require('../logger');
const R = require('../resources');

const REQUIRED_CREATE_FIELDS = ['name', 'email', 'location', 'password'];
const PUBLIC_WRITE_FIELDS = ['name', 'email', 'location', 'password'];
const PUBLIC_READ_FIELDS = ['id', 'name', 'email', 'location'];

function createUserModel(db) {
    const User = db.define('User', {
        id: {type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4},
        name: {type: Sequelize.STRING, allowNull: false},
        email: {
            type: Sequelize.STRING, allowNull: false, unique: true,
            validate: {isEmail: true, notEmpty: true}
        },
        location: {type: Sequelize.STRING, allowNull: false, defaultValue: ''},
        passwordSalt: {type: Sequelize.STRING, allowNull: false, field: 'password_salt'},
        passwordHash: {type: Sequelize.STRING, allowNull: false, field: 'password_hash'}
    }, {
        classMethods: {
            findByEmail: function (email) {
                return User.find({where: {email: email}});
            },

            extract: function (obj) {
                return _.pick(obj, PUBLIC_WRITE_FIELDS);
            },

            sanitize: function (user) {
                return _.pick(user, PUBLIC_READ_FIELDS);
            },

            createFieldsExist: function (obj) {
                return _.every(REQUIRED_CREATE_FIELDS, (field) =>  _.has(obj, field));
            },

            authenticate: function (email, password) {
                return User.findByEmail(email)
                    .then((user) => {
                        return new Promise((accept, reject) => {
                            if (!user) {
                                reject(R.error.invalidUser);
                            } else if (user.comparePassword(password)) {
                                accept(user);
                            } else {
                                reject(R.error.invalidPassword);
                            }
                        });
                    });
            }
        },
        instanceMethods: {
            comparePassword: function (plaintext) {
                return bcrypt.compareSync(plaintext, this.passwordHash);
            }
        },
        getterMethods: {},
        setterMethods: {
            password: function (plaintext) {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(plaintext, salt);

                this.setDataValue('passwordSalt', salt);
                this.setDataValue('passwordHash', hash);

                return this;
            }
        }
    });

    return User;
}

module.exports = createUserModel;
