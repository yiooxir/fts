var checkAuth = require('../middleware/checkAuth');

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

    app.get('/users/getNameByToken/:token', require('./users').getNameByToken);

    app.post('/users/create', require('./users').post);

    app.post('/users/tokens', checkAuth.isSuperUser, require('./users').createToken);

    app.get('/users/tokens', checkAuth.isSuperUser, require('./users').getTokens);

    app.get('/users/tokens/:token', require('./users').getToken);

    app.post('/users/login', require('./auth').login);

    app.post('/users/logout', require('./auth').logout);

    app.put('/users/:user', require('./users').put);

    app.put('/users/:id/linkToFirm', require('./users').linkToFirm);

    app.put('/users/:id/excludeFirm', require('./users').excludeFirm);


    /* FIRMS ROUTES
     * ------------------------------------------------*/

    app.post('/firms/create', require('./firms').post);

    app.put('/firms/:id', require('./firms').put);

    app.get('/firms', require('./firms').get);


    /* COUNTS ROUTER
     * ------------------------------------------------*/

    app.get('/counts', require('./counts').get);
    app.post('/counts/create', require('./counts').post);
    app.put('/counts/:id', require('./counts').put);
};




