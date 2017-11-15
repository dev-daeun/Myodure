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



router.get('/urgent', async function(req, res, next) {
  try{
      let urgentList = await PostDAO.selectUrgent();
      res.status(200).send((JSON.parse(JSON.stringify(urgentList))));
      
  }catch(err){
      next(err);
  }
});


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



router.get('/logout', require('./auth').isAuthenticated, async function(req, res, next){
  req.session.destroy(err => {
    if(err) next(new CustomError(500, err.message || err));
    req.user = null;
    res.clearCookie('GoodCat')
       .clearCookie('connect.sid')
       .status(200)
       .redirect('/login');
});
});



router.delete('/signout', require('./auth').isAuthenticated, async function(req, res, next){
  try{
    await UserDAO.deleteById(req.session.passport.user);
    req.session.destroy(err => {
      if(err) next(new CustomError(500, err.message || err));
      req.user = null;
      res.clearCookie('GoodCat')
         .clearCookie('connect.sid')
         .status(200)
         .send(true);
    });
  }catch(err){
    next(err);
  }
});




module.exports = router;
