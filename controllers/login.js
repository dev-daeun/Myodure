const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const passport = require('../libs/passport');
const Jwt = require('../libs/jwt');
const LocalError = require('../libs/error');

router.get('/', async function(req, res, next){
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

router.post('/', async function(req, res, next){
    try{
      passport.authenticate('local', { 
        failureFlash: true 
      },(err, user, message) => {
        if(err) return next(new LocalError(500, err.message || err));
        if(!user) return next(new LocalError(401, '해당 사용자가 존재하지 않습니다.'));
        try{
          req.logIn(user, async err => {
              if(err) throw err;
              var newToken = await Jwt.generateToken(String(user));
              res.status(200).cookie('GoodCat', newToken).send(true);
          });
        }catch(err){
          throw err;
        }
      })(req, res, next);
    }catch(err){
      next(err);
    }
  });
  
  


  module.exports = router;