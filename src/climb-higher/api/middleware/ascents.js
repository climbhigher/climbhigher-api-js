'use strict';

const _ = require('lodash');

const R = require('../../resources');
const logger = require('../../logger');

function AscentMiddleware(db, common) {
    this._Ascent = db.Ascent;
    this._common = common;
}

_.extend(AscentMiddleware.prototype, {
    invalidAscentError: function (req, res) {
        const body = this._common.errorBody(R.error.invalidAscent);
        return res.status(R.status.badRequest).send(body);
    },

    ascentNotFoundError: function(req, res) {
        const body = this._common.errorBody(R.error.invalidAscent);
        return res.status(R.status.notFound).send(body);
    },

    fetchById: function (req, res, next, ascentId) {
        logger.verbose('ascents.fetchById - ascentId ' + ascentId);

        this._Ascent.findById(ascentId)
            .then((ascent) => {
                if (ascent) {
                    req.climbSessionAscent = ascent;
                    next();
                } else {
                    this.ascentNotFoundError(req, res);
                }
            })
            .catch((err) => {
                logger.warn('ascents.fetchById - ' + err);
                this.invalidAscentError(req, res);
            });
    },

    create: function (req, res) {
        const newAscent = this._Ascent.extract(req.body);

        logger.verbose('ascents.create - ' + JSON.stringify(newAscent));

        this._Ascent.create(newAscent)
            .then((createdAscent) => res.status(R.status.created).send(this._Ascent.sanitize(createdAscent)))
            .catch(() => this.invalidAscentError(req, res));
    },

    destroy: function (req, res) {
        logger.verbose('ascents.destroy - body ' + JSON.stringify(req.body));

        req.climbSessionAscent.destroy()
            .then(() => res.status(R.status.noContent).send())
            .catch((err) => {
                logger.error(err);
                this._common.internalError(req, res)
            });
    }
});

module.exports = AscentMiddleware;
