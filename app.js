const express = require('express');
const session = require('express-session');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

const redisCfg = require('./config.json').redis;
const redisStore = require('connect-redis')(session);
const redis = require('redis')
const client = redis.createClient({
  password: redisCfg.password
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//redis as session
app.use(session({
  secret: redisCfg.secret,
  // create new redis store.
  store: new redisStore({ 
    host: redisCfg.host, 
    port: redisCfg.port, 
    client: client
  }),
  saveUninitialized: false,
  resave: false
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/', require('./controllers/index'));
app.use('/user', require('./controllers/user'));
app.use('/post', require('./controllers/post'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  res.status(err.status || 500).send(err.message);
});



module.exports = app;
