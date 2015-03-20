var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;
var async = require('async');
var User = require('../models/user').User;
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
    created: {
        type: Date,
        default: Date.now
    }
});

schema.statics.create = function(username, callback) {
    var Token = this;

    async.waterfall([
        function(callback) {
            User.find({username: username}, callback)
        },
        function(users, callback) {
            if (users.length) callback(new Error('the specified user is already exists'));
            Token.remove({username: username}, callback)
        },
        function(a, b, callback) {
            var token = new Token({username: username, token: Math.round(Math.random()*1000000000000)});
            token.save(callback)
        },
        function(token, b, callback) {

            var link = '<p>Сообщение!</p>' +
                '<a href = http://nsfn.net/auth?token=' +token.token + '>Для регистрации в сервисе перейдите по ссылке</a>';

            var transporter = nodemailer.createTransport({
                service: 'yandex',
                auth: {
                    user: 'nsfn.n@yandex.ru',
                    pass: 'Nikrol4'
                }
            });

            var mailOtptions = {
                from: 'nsfn.n@yandex.ru',
                to: 'spectrs@bk.ru',
                subject: 'Уведомление от сервиса NSFN',
                html: link
            };

            transporter.sendMail(mailOtptions, function(err, info) {
                if (err) return callback(new Error('message was not send' + err));
                callback(null, token);
            });
        }
    ], callback)
};

exports.Token = mongoose.model('Token', schema);
