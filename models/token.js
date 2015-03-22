var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;
var async = require('async');

var nodemailer = require('nodemailer');

var schema = new Schema({
    token: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    startNum: {
        type: Number,
        default: 0
    },
    firm: {
        type: Object
    },
    used: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.statics.create = function(username, firm, callback) {
    var Token = this;
    var User = require('./user').User;

    async.waterfall([
        function(callback) {
            User.find({username: username}, callback)
        },
        function(users, callback) {
            if (users.length) return callback(new Error('the specified user is already exists'));
            Token.remove({username: username}, callback)
        },
        function(res, callback) {
            var token = new Token({
                username: username,
                token: Math.round(Math.random()*1000000000000),
                firm: firm
            });
            token.save(callback)
        },
        function(token, num, callback) {

            //return callback(null, token);

            var link = "<p>Уведомление от сервиса НСФН. </p> <a href = 'http://nsfn.net/auth?token="
                + token.token + "'>Для регистрации в сервисе перейдите по ссылке</a>";

            var transporter = nodemailer.createTransport({
                service: 'yandex',
                auth: {
                    user: 'nsfn.n@yandex.ru',
                    pass: 'Nikrol4'
                }
            });

            var mailOptions = {
                from: 'nsfn.n@yandex.ru',
                to: 'spectrs@bk.ru',
                subject: 'Уведомление от сервиса НСФН.',
                html: link
            };

            transporter.sendMail(mailOptions, function(err, info) {
                if (err) return callback(new Error('message was not send' + err));
                callback(null, token);
            });
        }
    ], callback)
};

exports.Token = mongoose.model('Token', schema);
