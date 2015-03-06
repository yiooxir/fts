/**
 * Created by sergey on 06.03.15.
 */

var User = require('../models/user').User,
    httpError = require('../error').HttpError;

exports.post = function(req, res, next) {
    var userName = req.body.userName,
        password = req.body.password;

    User.find({username: userName}, function(err, user) {

        if (err) next(err);

        if (!user) new httpError(403, 'user is exists');

        res.json('stub for user create');
    });
};
