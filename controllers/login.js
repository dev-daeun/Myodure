const express = require('express');
const router = express.Router();
const ejs = require('ejs');

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
  
  


  module.exports = router;