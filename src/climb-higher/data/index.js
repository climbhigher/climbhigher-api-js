'use strict';

const ClimbStyle = require('./climb-style');
const ClimbGrade = require('./climb-grade');
const ClimbFinish = require('./climb-finish');
const createUserModel = require('./user-model');
const createSessionModel = require('./session-model');
const createAscentModel = require('./ascent-model');

module.exports = {
    ClimbStyle: ClimbStyle,
    ClimbGrade: ClimbGrade,
    ClimbFinish: ClimbFinish,
    createUserModel: createUserModel,
    createSessionModel: createSessionModel,
    createAscentModel: createAscentModel
};
