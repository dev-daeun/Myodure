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
        var user, isOwnInfo; 
        if(req.query.user) {
            user = req.query.user;
            isOwnInfo = false;
        }
        else {
            user = req.session.passport.user;
            isOwnInfo = true;
        }
        let userInfo = await UserDAO.selectByCol('id', user);
        userInfo[0].phone = encryption.decrypt(userInfo[0].phone);
        userInfo[0].isOwnInfo = isOwnInfo;
        delete userInfo[0].password; 
        
        ejs.renderFile('views/user-info.html', {user: userInfo[0]}, (err, view) => {
            if(err) next(err);
            else res.status(200).send(view);
        });
    }catch(err){
        next(err);
    }
});


module.exports = router;
