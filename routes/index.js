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

    app.get('/users', checkAuth.isLoggedIn, require('./users').get);

    app.get('/users/me', checkAuth.isLoggedIn, require('./users').me);

    app.get('/users/find/:admin', checkAuth.isLoggedIn, require('./users').find);

    app.get('/users/getNameByToken/:token', require('./users').getNameByToken);

    app.post('/users/create', require('./users').post);

    app.post('/users/tokens', checkAuth.isSuperUser, require('./users').createToken);

    app.get('/users/tokens', checkAuth.isSuperUser, require('./users').getTokens);

    app.delete('/users/tokens/:tokenId', checkAuth.isSuperUser, require('./users').removeToken);

    app.get('/users/tokens/:token', require('./users').getToken);

    app.post('/users/login', require('./auth').login);

    app.post('/users/logout', require('./auth').logout);

    app.put('/users/:user', checkAuth.isSuperUser, require('./users').put);

    app.put('/users/:id/linkToFirm', checkAuth.isSuperUser, require('./users').linkToFirm);

    app.put('/users/:id/excludeFirm', checkAuth.isSuperUser, require('./users').excludeFirm);


    /* FIRMS ROUTES
     * ------------------------------------------------*/

    app.post('/firms/create', checkAuth.isSuperUser, require('./firms').post);

    app.put('/firms/:id', checkAuth.isSuperUser, require('./firms').put);

    app.get('/firms', checkAuth.isLoggedIn, require('./firms').get);


    /* COUNTS ROUTER
     * ------------------------------------------------*/

    app.get('/counts', checkAuth.isLoggedIn, require('./counts').get);
    app.post('/counts/create', checkAuth.isLoggedIn, require('./counts').post);
    app.put('/counts/:id', checkAuth.isLoggedIn, require('./counts').put);
    app.delete('/counts/:id', checkAuth.isLoggedIn, require('./counts').delete);
};




