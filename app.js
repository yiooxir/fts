var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var config = require('config');
var mongoose = require('./lib/mongoose');
var MongoStore = require('connect-mongostore')(session);
//var router = express.Router();
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/client/build')));
app.use(session({
    secret: config.get('session.secret'),
    key: config.get('session.key'),
    cookie: config.get('session.cookie'),
    store: new MongoStore({'db': mongoose.connections[0].name}),
    resave: false,
    saveUninitialized: true
}));

app.use(require('./middleware/currentUser'));
app.use(require('./middleware/setCORS'));


routes(app);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
        console.log(err.status, err.message, err.stack);
        res.status(err.status || 500).json(err.message);

  });
}

// production error handler
// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  res.render('error', {
//    message: err.message,
//    error: {}
//  });
//});



var port = config.get('port');
http.createServer(app).listen(port, function() {
    console.log('start server on port ', port);
});

module.exports = app;
