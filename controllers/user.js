const UserDAO = require('../DAOs/user');
const encryption = require('../libs/encryption');

const CustomError = require('../libs/error');
const express = require('express');
const router = express.Router();
const ejs = require('ejs');

const moment = require('moment');



router.use(require('./auth').isAuthenticated);

router.get('/', async function(req, res, next){
    try{
        var user; 
        if(req.query.user) user = req.query.user;
        else user = req.session.passport.user;

        let userInfo = await UserDAO.selectByCol('id', user);
        userInfo[0].phone = encryption.decrypt(userInfo[0].phone);

        ejs.renderFile('views/user-info.html', {user: userInfo[0]}, (err, view) => {
            if(err) next(err);
            else res.status(200).send(view);
        });
    }catch(err){
        next(err);
    }
});


module.exports = router;
