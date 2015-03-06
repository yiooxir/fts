var User = require('../models/user').User;


exports.get = function(req, res, next) {
    res.send('users');
};

