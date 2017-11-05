const express = require('express');
const session = require('express-session');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const ejs = require('ejs');

const passport = require('./libs/passport');
const redisCfg = require('./config.json').redis;
const redisStore = require('connect-redis')(session);
const redis = require('redis')
const client = redis.createClient({
  password: redisCfg.password
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: redisCfg.secret,
  // create new redis store.
  store: new redisStore({ 
    host: redisCfg.host, 
    port: redisCfg.port, 
    client: client
  }),
  saveUninitialized: false,
  resave: false,
  cookie: {
    key: ['GoodCat'],
    maxAge: 24000 * 60 * 60
  }
}));
app.use(passport.initialize());
app.use(passport.session());



app.use(express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/', require('./controllers/index'));
app.use('/post', require('./controllers/post'));
app.use('/favor', require('./controllers/favor'));
app.use('/phone', require('./controllers/phone'));

// error handler
app.use(function(err, req, res, next) {
  if(err.status=="404"){
      ejs.renderFile('views/404.ejs', (err, view) => {
        if(err) return res.status(err.status || 500).send(err.message);
        return res.status(404).send(view);
      });
  }
  console.log(err);
  res.status(err.status || 500).send(err.message);
});



module.exports = app;
