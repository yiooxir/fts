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

    var name = req.body.name;

    if (res.locals.user && !res.locals.user.isSuperUser)
        return next(new HttpError(403, 'to create new firm can only user with admin rights'));

    if (!name)
        return next(new HttpError(422, 'more parameters are required'));

    var firm = new Firm({name: name});

    firm.save(function(err, firm) {
        if (err) return next(new HttpError(500, err.message));

        res.json(firm);
    })
};

exports.put = function(req, res, next) {

    var name = req.body.name,
        id = req.params.id;

    if (res.locals.user && !res.locals.user.isSuperUser)
        return next(new HttpError(403, 'to change the firm can only user with admin rights'));

    if (!name)
        return next(new HttpError(422, 'more parameters are required'));

    Firm.findOneAndUpdate({_id: id}, {name: name}, function(err, firm) {
        if (err) return next(500);

        res.json(firm);
    })
};
