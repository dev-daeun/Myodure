const express = require('express');
const router = express.Router();
const ejs = require('ejs');

const coolsms = require('../libs/coolsms');
const UserDAO = require('../DAOs/user');
const PostDAO = require('../DAOs/post');
const ChatDAO = require('../DAOs/chat');
const UserService = require('../services/user');
const LocalError = require('../libs/error');
const Redis = require('../libs/redis');
const passport = require('../libs/passport');
const Encryption = require('../libs/encryption');
const Jwt = require('../libs/jwt');



/* GET home page. */
router.get('/', async function(req, res, next) {
  try{
      ejs.renderFile('views/index.html', (err, view) => {
          if(err) next(err);
          else res.status(200).send(view);
      });
  }catch(err){
      next(err);
  }
});

router.get('/nav', async function(req, res, next) {
  try{
      ejs.renderFile('views/navigation.html', (err, view) => {
          if(err) next(err);
          else res.status(200).send(view);
      });
  }catch(err){
      next(err);
  }
});

router.get('/navBeforeLogin', async function(req, res, next) {
  try{
      ejs.renderFile('views/navBeforeLogin.html', (err, view) => {
          if(err) next(err);
          else res.status(200).send(view);
      });
  }catch(err){
      next(err);
  }
});

router.get('/urgent', async function(req, res, next) {
  try{
      let urgentList = await PostDAO.selectUrgent();
      res.status(200).send((JSON.parse(JSON.stringify(urgentList))));
      
  }catch(err){
      next(err);
  }
});

router.get('/signup', async function(req, res, next){
  try{
    ejs.renderFile('views/signup.html', (err, view) => {
        if(err) next(err);
        else res.status(200).send(view);
    });
  }
  catch(err){
    return next(new LocalError(500, err.message || err));
  }
});

/* 회원가입 */
router.post('/signup', async function(req, res, next){
  try{
      let emailDup = await UserService.checkDup("email", req.body.user.email);
      if(emailDup) next(new LocalError(400,  "이미 사용중인 이메일 주소입니다."));
      let phoneDup = await UserService.checkDup("phone", Encryption.encrypt(req.body.user.phone));
      if(phoneDup) next(new LocalError(400,  "이미 사용중인 핸드폰 번호입니다."));
      let usernameDup = await UserService.checkDup("username", req.body.user.username);
      if(usernameDup) next(new LocalError(400,  "이미 사용중인 사용자 이름입니다."));
     
      let getValue = await Redis.getValue(req.body.user.phone);
      console.log(getValue);
      if(getValue!=="authorized") return next(new LocalError(401, "전화번호가 인증되지 않았습니다."));
      let newUser = await UserService.signup(req.body.user);
      res.status(201).send(true);
    
  }catch(err){
    next(err);
  }   
});



router.post('/login', async function(req, res, next){
  try{
    passport.authenticate('local', { 
      failureFlash: true 
    },(err, user, info) => {
      if(err) return next(new LocalError(500, err.message || err));
      if(!user) return next(new LocalError(401, info));
      req.logIn(user, async err => {
          if(err) return next(new LocalError(500, err.message || err));
          let newToken = await Jwt.generateToken(String(user));
          res.status(200).cookie('GoodCat', newToken).send(true);
      });
    })(req, res, next);
  }catch(err){
    next(err);
  }
});


router.get('/login', async function(req, res, next){
  try{
    ejs.renderFile('views/login.html', (err, view) => {
        if(err) next(err);
        else res.status(200).send(view);
    });
  }
  catch(err){
    return next(new LocalError(500, err.message || err));
  }
});

router.use(require('./auth').isAuthenticated);


router.get('/logout', async function(req, res, next){
  req.session.destroy(err => {
    if(err) next(new CustomError(500, err.message || err));
    req.user = null;
    res.clearCookie('GoodCat')
       .clearCookie('connect.sid')
       .status(200)
       .redirect('/login');
});
});



router.delete('/signout', async function(req, res, next){
  try{
    await UserDAO.deleteById(req.id);
    req.session.destroy();
    req.id = null;
    res.status(200).send(true);
  }catch(err){
    next(err);
  }
});




module.exports = router;
