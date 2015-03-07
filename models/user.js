/**
 * Created by sergey on 06.03.15.
 */

var crypto = require('crypto');
var async = require('async');
var util = require('util');

var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    isSuperUser: {
        type: Boolean,
        default: false
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.hashedPassword;
    delete obj.salt;
    delete obj.isSuperUser;
    return obj
};

schema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword; });


schema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.authorize = function(username, password, callback) {
    var User = this;

    async.waterfall([
        function(callback) {
            User.findOne({username: username}, callback);
        },
        function(user, callback) {
            if (user && user.checkPassword(password)) {
                callback(null, user);
            } else {
                callback(new AuthError("wrong username or password"));
            }

        }
    ], callback);
};


exports.User = mongoose.model('User', schema);

schema.statics.create = function(username, password, callback) {
    var User = this;

    async.waterfall([
        function(cb) {
            User.findOne({username: username}, cb);
        },
        function(user, cb) {
            if (user) {
                throw new Error()
            }
        }
    ])
};

function AuthError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);

    this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;
