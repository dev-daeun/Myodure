const express = require('express');
const router = express.Router();
const ejs = require('ejs');

const UserDAO = require('../DAOs/user');
const PostDAO = require('../DAOs/post');
const UserService = require('../services/user');
const Error = require('../libs/error');
const Redis = require('../libs/redis');
const Encryption = require('../libs/encryption');
const Auth = require('../libs/auth');

/* GET home page. */
router.get('/', async function(req, res, next) {
  try{
      let urgentList = await PostDAO.selectUrgent();
      console.log(urgentList);
      ejs.renderFile('views/index.ejs', {urgent: urgentList}, (err, view) => {
          if(err) next(err);
          else res.status(200).send(view);
      });
  }catch(err){
      next(err);
  }
});



/* 회원가입 */
router.post('/signup', async function(req, res, next){
  try{
      if(!req.body.email) next(new Error(400, "이메일 주소를 입력하세요."));
      if(!req.body.address) next(new Error(400, "비밀번호를 입력하세요."));
      if(!req.body.phone) next(new Error(400, "핸드폰 번호를 입력하세요."));
      if(!req.body.username) next(new Error(400, "이름을 입력하세요."));
      if(!req.body.address) next(new Error(400, "거주지를 입력하세요."));

      let getValue = await Redis.getValue(req.body.phone, "authorized");
      // if(!getValue) next(401, "전화번호가 인증되지 않았습니다.");
      // else{
          let emailDup = await UserService.checkDup("email", req.body.email);
          if(emailDup) next(new Error(400,  "이미 사용중인 이메일 주소입니다."));
          let phoneDup = await UserService.checkDup("phone", Encryption.encrypt(req.body.phone));
          if(phoneDup) next(new Error(400,  "이미 사용중인 핸드폰 번호입니다."));
          let usernameDup = await UserService.checkDup("username", req.body.username);
          if(usernameDup) next(new Error(400,  "이미 사용중인 사용자 이름입니다."));

          await UserService.signup(req.body.username, req.body.email, req.body.phone, req.body.password, req.body.address);
          res.status(201).send(true);
    // }
  }catch(err){
    next(err);
  }   
});



router.post('/login', async function(req, res, next){
    try{
      if(!req.body.email) next(new Error(400, "이메일 주소를 입력하세요."));
      if(!req.body.password) next(new Error(400, "비밀번호를 입력하세요."));
      
      let rightInfo = await UserService.login(req.body.email, req.body.password);
      if(!rightInfo) next(new Error(401, "잘못된 이메일 주소 혹은 비밀번호 입니다."));
      else {
        let token = await Auth.generateToken(rightInfo);
        req.session.token = token;
        res.status(200).send(token);
      }
    }catch(err){
      next(err);
    }
});



// router.use(require('./auth'));



router.post('/logout', async function(req, res, next){
  try{
    req.session.destroy();
    req.id = null;
    res.status(200).send(true);
  }catch(err){
    next(err);
  }
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
