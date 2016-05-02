'use strict';

const CommonMiddleware = require('./common');
const SessionsMiddleware = require('./sessions');
const AscentsMiddleware = require('./ascents');
const UsersMiddleware = require('./users');

module.exports = {
    Common: CommonMiddleware,
    Users: UsersMiddleware,
    Sessions: SessionsMiddleware,
    Ascents: AscentsMiddleware
};
