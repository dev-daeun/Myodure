const express = require('express');
const router = express.Router();
const ejs = require('ejs');


router.get('/', async function(req, res, next){
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
  router.post('/', async function(req, res, next){
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

  

  module.exports = router;