//var express = require('express');
//var router = express.Router();



//router.get('/users', require('./users').get);

module.exports = function(app) {

    app.get('/', function(req, res, next) {
        res.send('error');
    });

    app.get('/users', require('./users').get);

    app.post('/users/login', require('./login').post);
    app.post('/users/create', require('./createUser').post)
};
