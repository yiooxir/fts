var User = require('../models/user').User;
var HttpError = require('../error').HttpError;

exports.get = function(req, res, next) {
    if (!res.locals.user) return next(new HttpError(403, 'the user is not logged in'));

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

exports.post = function(req, res, next) {
    var userName = req.body.userName,
        password = req.body.password;

    if (!userName || !password) return next(new HttpError(422, 'username and password are required'));

    if (!res.locals.user.isSuperUser) return next(new HttpError(403, 'you do not have appropriate rights to create new user. please logout'));

    User.findOne({username: userName}, function(err, user) {

        if (err) next(err);

        if (user) return next(new HttpError(403, 'user with same name is already exists'));

        user = new User({username: userName, password: password});

        user.save(function(err, user) {
            if (err) next(err);
            res.json(user);
        })
    });
};

exports.me = function(req, res, next) {
    if (!res.locals.user) return next(new HttpError(403, 'user not logged in'));

    res.json(res.locals.user);
};
