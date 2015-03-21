/**
 * Created by sergey on 07.03.15.
 */

var User = require('../models/user').User;

module.exports = function(req, res, next) {
    req.user = res.locals.user = null;

    console.info('req.session.userID: ', req.session.user)
    if (!req.session.user) return next();

    User.findById(req.session.user, function(err, user) {
        if (err) return next(err);

        console.info('AUTH: user save to res.locals.user', user.username);
        req.user = res.locals.user = user;
        next();
    });
};
