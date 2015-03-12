/**
 * Created by sergey on 06.03.15.
 */

var User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;
var async = require('async');


exports.post = function(req, res, next) {
    var username = req.body.userName;
    var password = req.body.password;


    if (!username || !password) {
        res.set({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
            //"Access-Control-Allow-Methods": "GET, POST, DELETE, PUT",
        });
        res.json('error. no parameters ');
        return;
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
        res.set({
            "Access-Control-Allow-Origin": "*"
            //"Access-Control-Allow-Methods": "GET, POST, DELETE, PUT",
        });
        res.json(user);
    });

};
