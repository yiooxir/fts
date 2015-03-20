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
            token.save(function(err, token) {
                if (err) return callback(err);
                callback(null, token);
            })
        }
    ], callback)
};

exports.Token = mongoose.model('Token', schema);
