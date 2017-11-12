const LocalError= require('../libs/error');
const User = require('../services/user');
const Jwt = require('../libs/jwt');
const jwtCfg = require('../config.json').jwt;
const ejs = require('ejs');

module.exports.isAuthenticated = async function(req, res, next){
    try{
        if(!req.cookies.GoodCat){
            ejs.renderFile('views/login.html', (err, view) => {
                if(err) throw err;
                else return res.status(200).send(view);
            });
        }
        else {
            let decoded = await Jwt.verifyToken(req.cookies.GoodCat);
            if(!req.session.passport) next(new LocalError(401, '세션이 만료되었습니다.'));
            else if(parseInt(decoded.data)!== req.session.passport.user)
                return next(new LocalError(401, '유효하지 않은 사용자 정보입니다.'));
            else next();  
        }  
    }catch(err){
        return next(new LocalError(500, err.message || err));
    }
}