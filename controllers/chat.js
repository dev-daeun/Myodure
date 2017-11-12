const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const moment = require('moment');
const ChatDAO = require('../DAOs/chat');
const ChatService = require('../services/chat');

router.use(require('./auth').isAuthenticated);


router.get('/list', async function(req, res, next){
  try{
    let list = await ChatDAO.selectAll(req.session.passport.user);
    list.forEach(element => {
        element.sent_time = moment(element.sent_time).format('YY.MM.DD HH:mm:ss');
    });
    res.status(200).send(JSON.parse(JSON.stringify(list)));
  }catch(err){
    next(err);
  }
});

router.get('/:salerId', async function(req, res, next){
  try{  
      let result = await ChatService.startChat(req.params.salerId, req.session.passport.user);
      console.log(result)
      ejs.renderFile('views/chat-room.html', {talkId: result}, (err, view) => {
        if(err) throw err;
        else res.status(200).send(view);
      });
  }catch(err){
      next(err);
  }
});

router.get('/', function(req, res, next){
    ejs.renderFile('views/chat-index.html', (err, view) => {
      if(err) next(err);
      else res.status(200).send(view);
    });
});

router.post('/', async function(req, res, next){
    try{
      let newTalk = await ChatDAO.insert(req.body.salerId, req.session.passport.user);
      res.status(201).send(newTalk+"");
    }catch(err){
      next(err);
    }  
});




  module.exports = router;