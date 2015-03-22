/**
 * Created by sergey on 16.03.15.
 */

var User = require('../models/user').User;
var Firm = require('../models/firm').Firm;
var Count = require('../models/count').Count;
var HttpError = require('../error').HttpError;

exports.get = function(req, res, next) {
    var user = res.locals.user;
    var query = user.isSuperUser ? {} : {createdBy: user._id.toString()};

    Count.find(query, function(err, counts) {
        if (err) return next(err);

        res.json(counts);
    })
};

exports.post = function(req, res, next) {

    var count = new Count(req.body);

    count.save(function(err, count) {
        if (err) return next(err);

        res.json(count);
    })
};

exports.put = function(req, res, next) {

    Count.findOneAndUpdate({_id: req.params.id}, req.body, function(err, count) {
        if(err) return next(err);

        res.json(count);
    })
};

exports.delete = function(req, res, next) {

    Count.findOneAndRemove({_id: req.params.id}, {},  function(err, data) {
        if (err) return next(err);
        res.json({removed: req.params.id});
    })
};
