/**
 * Created by sergey on 06.03.15.
 */

var User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;
var async = require('async');


exports.login = function(req, res, next) {
    var username = req.body.userName;
    var password = req.body.password;


    if (!username || !password) {
        return next( new HttpError(422, 'require more parameters'));
    }

    User.authorize(username, password, function(err, user) {
        if (err) {
            if (err instanceof AuthError) {
                return next(new HttpError(403, err.message));
            } else {
                return next(err);
            }
        }

        req.session.user = user._id;

        res.json(user);
    });

};

exports.logout = function(req, res, next) {

    req.session.destroy(function(err) {
        if (err) return next(new HttpError(500));
        res.json('logout');
    });
};
