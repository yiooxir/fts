var User = require('../models/user').User;
var HttpError = require('../error').HttpError;

exports.get = function(req, res, next) {
    if (!res.locals.user) return next(new HttpError(403, 'forbidden'));

    if (res.locals.user.isSuperUser) {
        User.find({}, function(err, users) {
            if (err) return next(err);
            res.json(users);
        })
    }
    else {
        res.json(res.locals.user);
    }
};

exports.find = function(req, res) {
    var username = req.body.userName;
    res.json('123');
};

