var User = require('../models/user').User;
var Firm = require('../models/firm').Firm;
var Token = require('../models/token').Token;

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
        res.json([res.locals.user]);
    }
};

exports.find = function(req, res) {
    var username = req.body.userName;
    res.json('123');
};

/* create user */
exports.post = function(req, res, next) {
    var userName = req.body.userName,
        password = req.body.password,
        token = req.body.token;

    if (!userName || !password) return next(new HttpError(422, 'username and password are required'));

    User.create(userName, password, token, function(err, user) {
        if (err) return next(err);
        res.json(user);
    });

    //User.findOne({username: userName}, function(err, user) {
    //
    //    if (err) next(err);
    //
    //    if (user) return next(new HttpError(403, 'user with same name is already exists'));
    //
    //    user = new User({username: userName, password: password});
    //
    //    user.save(function(err, user) {
    //        if (err) next(err);
    //
    //        res.json(user);
    //    })
    //});
};

exports.me = function(req, res, next) {
    if (!res.locals.user) return next(new HttpError(403, 'user not logged in'));

    res.json(res.locals.user);
};


// test data: firmId: 5505d13969de70d01fbb6953, userId: 550482d33dd86cb87276f64b
exports.linkToFirm = function(req, res, next) {

    var firmId = req.body.firmId,
        userId = req.params.id;

    if (!firmId || !userId)
        return next(new HttpError(422, 'bad parameters'));

    Firm.findById(firmId, function(err, firm) {
        if (err) return next(new HttpError(422, 'firm with requested id is not found'));

        User.findOneAndUpdate({_id: userId}, {$addToSet: {firms: firmId}}, function(err, firm) {
            if (err) return next(err);

            res.json(firm)
        })
    })
};

exports.excludeFirm = function(req, res, next) {

    var firmId = req.body.firmId,
        userId = req.params.id;

    if (!firmId || !userId)
        return next(new HttpError(422, 'bad parameters'));

    User.findOneAndUpdate({_id: userId}, {$pull: {firms: firmId}}, function(err, firm) {
        if (err) return next(err);

        res.json(firm);
    })
};


exports.createToken = function(req, res, next) {
    var username = req.body.username;

    if (!username) return next(new HttpError(422, 'email is not specified'));

    Token.create(username, function (err, token) {
        if (err) return next(err);

        res.json(token);
    });
};


exports.getNameByToken = function(req, res, next) {
    var token = req.params.token;
    if (!token) return next(new HttpError(422, 'token is required'));

    Token.find({token: token}, function(err, token) {
        if (err) return next(new HttpError(403, 'bad token'));
        res.json(token);
    })
};

exports.getTokens = function(req, res, next) {
    Token.find({used: req.query.used}, function(err, query) {
        if (err) return next(err);
        res.json(query);
    })
};

exports.getToken = function(req, res, next) {
    Token.findOne({token: req.params.token}, function(err, token) {
        if (err) return next(err);
        if (!token) return next(new HttpError(403, 'bad token'));
        res.json(token);
    })
};
