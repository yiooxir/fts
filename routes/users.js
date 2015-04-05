var User = require('../models/user').User;
var Firm = require('../models/firm').Firm;
var Token = require('../models/token').Token;
var nodemailer = require('nodemailer');
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
    var token = req.body.token;
    delete req.body.token;
    var values = req.body;

    if (res.locals.user.isSuperUser) {
        var user = new User(req.body);

        user.save(function(err, user) {
            if (err) return next(err);
            return res.json(user);
        })
    } else {
        User.create(values, token, function(err, user) {
            if (err) return next(err);
            res.json(user);
        });
    }
};

exports.put = function(req, res, next) {

    User.findById(req.params.user, function(err, user) {
        if (err) return next(err);

        /* change password */
        if(req.body.hasOwnProperty('newPass')) {

            if (!req.body.newPass) return next(new HttpError(422, 'Новый пароль не может быть пустым.'));

            if (user.isSuperUser) {
                if (!req.body.hasOwnProperty('password') || !req.body.password) return next(new HttpError(422, 'Старый пароль не верен или пустой.'));
            }

            user.password = req.body.newPass;

            user.save(function(err, user) {
                if (err) return next(err);
                res.json(user);

                /* отправляем почту только для обычных пользователей */
                if (!user.isSuperUser) {
                    var link = "<p>Уведомление от сервиса НСФН. Пароль к вашему аккаунту изменен. Новый пароль " + req.body.newPass +"</p> " +
                        "<a href = 'http://nsfn.net/login'>форма входа</a>";

                    var transporter = nodemailer.createTransport({
                        service: 'yandex',
                        auth: {
                            user: 'nsfn.n@yandex.ru',
                            pass: 'Nikrol4'
                        }
                    });

                    var mailOptions = {
                        from: 'nsfn.n@yandex.ru',
                        to: user.username,
                        subject: 'Уведомление от сервиса НСФН.',
                        html: link
                    };

                    transporter.sendMail(mailOptions, function(err) {
                        if (err) return console.error('Ошибка при отправке почты.', err);
                        console.log('Сообщение о смене пароля отправлено пользователю на адрес: ', user.username);
                    });
                }
            });

        /* other changes */
        } else {
            User.findByIdAndUpdate(req.params.user, req.body, function(err, user) {
                if (err) return next(err);
                return res.json(user);
            })
        }
    });
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
    var username = req.body.username,
        firm = req.body.firm || 0;

    if (!username) return next(new HttpError(422, 'email is not specified'));

    Token.create(username, firm, function (err, token) {
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
        var dt = new Date() - token.created;
        if (dt > 1000*60*60*24*3) return next(new HttpError(403, 'the token is out of date'));
        res.json(token);
    })
};

exports.removeToken = function(req, res, next) {
    Token.findOneAndRemove({_id: req.params.tokenId}, function(err) {
        if (err) return next(err);
        res.json('the token is removed');
    })
};
