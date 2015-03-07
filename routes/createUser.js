/**
 * Created by sergey on 06.03.15.
 */

var User = require('../models/user').User,
    httpError = require('../error').HttpError;

exports.post = function(req, res, next) {
    var userName = req.body.userName,
        password = req.body.password;

    User.findOne({username: userName}, function(err, user) {

        if (err) next(err);

        if (user) return next(new httpError(403, 'user with same name is already exists'));

        user = new User({username: userName, password: password});

        user.save(function(err, user) {
            if (err) next(err);
            res.json(user);
        })
    });
};
