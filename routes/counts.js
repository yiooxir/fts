/**
 * Created by sergey on 16.03.15.
 */

var User = require('../models/user').User;
var Firm = require('../models/firm').Firm;
var Count = require('../models/count').Count;
var HttpError = require('../error').HttpError;

exports.get = function(req, res, next) {
    var user = res.locals.user;
    var query = user.isSuperUser ? {} : {createdBy: user._id};

    Count.find(query, function(err, counts) {
        if (err) return next(err);

        res.json(counts);
    })
};

exports.post = function(req, res, next) {
    var values = {};
    if (req.body.num) values.num = req.body.num;
    if (req.body.firm) values.firm = req.body.firm;
    values.createdBy = res.locals.user._id;

    var count = new Count(values);

    count.save(function(err, count) {
        if (err) return next(err);

        res.json(count);
    })
};

exports.put = function(req, res, next) {
    var countId = req.params.id;
    var value = {};
    if (req.body.num) value.num = req.body.num;
    if (req.body.firm) value.firm = req.body.firm;

    Count.findOneAndUpdate({_id: countId}, value, function(err, count) {
        if(err) return next(err);

        res.json(count);
    })
};

exports.delete = function(req, res, next) {

};
