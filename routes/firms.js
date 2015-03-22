/**
 * Created by sergey on 15.03.15.
 */

var User = require('../models/user').User;
var Firm = require('../models/firm').Firm;
var HttpError = require('../error').HttpError;

exports.get = function(req, res, next) {

    if (res.locals.user.isSuperUser) {
        Firm.find({}, function(err, firms) {
            if(err) return next(err);
            res.json(firms);
        })
    }
    else if (!res.locals.user.firms.length) {
        res.json([]);
    }
    else {
        Firm.find({
            '_id': { $in: res.locals.user.firms}
        }, function(err, firms){
            if (err) return next(err);
            res.json(firms);
        });
    }
};

exports.post = function(req, res, next) {

    var firm = new Firm(req.body);

    firm.save(function(err, firm) {
        if (err) return next(new HttpError(500, err.message));

        res.json(firm);
    })
};

exports.put = function(req, res, next) {
    Firm.findOneAndUpdate({_id: req.params.id}, req.body, function(err, firm) {
        if (err) return next(500);
        res.json(firm);
    })
};
