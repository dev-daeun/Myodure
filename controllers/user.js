const coolsms = require('coolsms');
const express = require('express');
const router = express.Router();

const LocalError = require('../libs/error');
const Redis = require('../libs/redis');
const smsConfig = require('../config').coolsms;

/* 사용자 전화번호 인증문자 발송  */
router.get('/phone', async function(req, res, next){
  try {
    let text = req.query.status = 'join' ? '가입' : '탈퇴';
    let random = Math.floor((Math.random() * 10000) + 1);;
    await Redis.setValue(req.query.phone, random, 1000*60*3);
    
    coolsms({
      ssl: false,            // true | false 
      user: smsConfig.user,     // CoolSMS username 
      password: smsConfig.password, // CoolSMS password 
      to: req.body.phone,    // Recipient Phone Number 
      from: smsConfig.from,  // Sender Phone Number 
      text: "묘두레 " + text + "인증번호는 " + random + "입니다."  // Text to send 
    }, (err) => {
      if (err) throw err;
      else res.status(200).send(true);
    });
  } catch(err) {
    next(err);
  }
});

router.post('/phone', async function(req, res, next){
  try {
    var getValue = await Redis.getValue(req.body.phone, req.body.number);
    if(!getValue) next(new LocalError(401, "잘못된 인증번호입니다."));
    else {
      await Redis.deleteValue(req.body.phone);
      await Redis.setValue(req.body.phone, "authorized", 1000*60*10);
      res.sendStatus(200).send("인증완료 되었습니다. 10분이내로 회원가입을 완료해주세요.");
    }
  } catch(err) {
    next(err);
  }
});

module.exports = router;
