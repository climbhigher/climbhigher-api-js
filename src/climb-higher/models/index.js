"use strict";

var models = module.exports = {
    ClimbFinish: require('./climb-finish'),
    ClimbGrade: require('./climb-grade'),
    ClimbStyle: require('./climb-style'),
    Session: require('./session'),
    Tick: require('./tick'),
    User: require('./user')
};

models.Session.belongsTo(models.User);

models.ClimbGrade.belongsTo(models.ClimbStyle);

models.Tick.belongsTo(models.Session);
models.Tick.belongsTo(models.ClimbStyle);
// models.Tick.belongsTo(models.ClimbGrade);
models.Tick.belongsTo(models.ClimbFinish);
