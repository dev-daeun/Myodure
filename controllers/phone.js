const express = require('express');
const router = express.Router();

const LocalError = require('../libs/error');
const coolsms = require('../libs/coolsms');
const Redis = require('../libs/redis');
const smsConfig = require('../config').coolsms;

router.get('/', async function(req, res, next){
    try{
        // let sentMsg = await coolsms(req.query.phone);
        const sentMsg = Math.floor(Math.random() * (999999 - 100000) + 1);
        console.log(sentMsg);
        await Redis.setValue(req.query.phone, sentMsg, 60*3);
        res.status(200).send(true);
    }catch(err){
        next(err);
    }  
});

router.post('/', async function(req, res, next){
    try{
        let result = await Redis.getValue(req.body.phone);
        if(result!==req.body.authNum) next(new LocalError(401, "잘못된 인증번호 입니다."));
        else{
            console.log(req.body.phone);
            console.log(req.body.authNum);
            await Redis.deleteValue(req.body.phone);
            await Redis.setValue(req.body.phone, "authorized", 60*10);
            res.status(200).send(true);
        }
    }catch(err){
        next(err);
    }
});

module.exports = router;