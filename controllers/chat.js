const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const moment = require('moment');
const ChatDAO = require('../DAOs/chat');


router.get('/', async function(req, res , next){
    try{
      let list = await ChatDAO.selectAll(1);
      list.forEach(element => {
          element.sent_time = moment(element.sent_time).format('YY.MM.DD HH:mm:ss');
      });
      console.log(JSON.parse(JSON.stringify(list)));

      ejs.renderFile('views/chat-index.ejs', {list: JSON.parse(JSON.stringify(list))}, (err, view) => {
        if(err) throw err;
        else res.status(200).send(view);
      });
    }catch(err){
      next(err);
    }
  });

  module.exports = router;