//var express = require('express');
//var router = express.Router();



//router.get('/users', require('./users').get);

module.exports = function(app) {

    app.options('*', function(req, res) {

        res.set({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT",
            //"Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        }).end();
    });

    app.get('/', function(req, res, next) {
        res.send('error');
    });

    /* USERS ROUTES
    * ------------------------------------------------*/

     app.get('/users', require('./users').get);

    app.get('/users/me', require('./users').me);

    app.get('/users/find/:admin', require('./users').find);

    app.post('/users/create', require('./users').post);

    app.post('/users/login', require('./auth').login);

    app.post('/users/logout', require('./auth').logout);

    app.put('/users/:id/linkToFirm', require('./users').linkToFirm);

    app.put('/users/:id/excludeFirm', require('./users').excludeFirm);


    /* FIRMS ROUTES
    * ------------------------------------------------*/

    app.post('/firms/create', require('./firms').post);

    app.put('/firms/:id', require('./firms').put);

    app.get('/firms', require('./firms').get);

};
