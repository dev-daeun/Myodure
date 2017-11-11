const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const moment = require('moment');
const ChatDAO = require('../DAOs/chat');


router.use(require('./auth').isAuthenticated);

router.get('/', function(req, res, next){
    ejs.renderFile('views/chat-index.html', (err, view) => {
      if(err) next(err);
      else res.status(200).send(view);
    });
});

router.get('/list', async function(req, res , next){
    try{
      let list = await ChatDAO.selectAll(req.session.passport.user);
      list.forEach(element => {
          element.sent_time = moment(element.sent_time).format('YY.MM.DD HH:mm:ss');
      });
      console.log(JSON.parse(JSON.stringify(list)));
      res.status(200).send(JSON.parse(JSON.stringify(list)));
    }catch(err){
      next(err);
    }
  });

  module.exports = router;