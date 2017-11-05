const express = require('express');
const router = express.Router();

const LocalError = require('../libs/error');
const coolsms = require('../libs/coolsms');
const Redis = require('../libs/redis');
const smsConfig = require('../config').coolsms;

router.get('/', async function(req, res, next){
    try{
        let sentMsg = await coolsms(req.query.phone);
        await Redis.setValue(req.query.phone, sentMsg, 60*3);
        res.status(200).send(true);
    }catch(err){
        next(err);
    }  
});

router.post('/', async function(req, res, next){
    try{
        let result = await Redis.getValue(req.body.phone, req.body.authNum);
        if(!result) next(new LocalError(401, "잘못된 인증번호 입니다."));
        else{
            await Redis.deleteValue(req.body.phone);
            await Redis.setValue(req.body.phone, "authorized", 60*10);
            res.status(200).send(true);
        }
    }catch(err){
        next(err);
    }
});

module.exports = router;