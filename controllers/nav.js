const express = require('express');
const router = express.Router();
const ejs = require('ejs');

router.get('/', async function(req, res, next) {
        if(req.cookies.GoodCat){
            ejs.renderFile('views/navigation.html', (err, view) => {
                if(err) next(err);
                else res.status(200).send(view);
            });
        }
        else{
            ejs.renderFile('views/navBeforeLogin.html', (err, view) => {
                if(err) next(err);
                else res.status(200).send(view);
            });
        }
});
  
  module.exports = router;