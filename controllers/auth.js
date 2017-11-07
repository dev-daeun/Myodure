const LocalError= require('../libs/error');
const User = require('../services/user');
const Jwt = require('../libs/jwt');
const jwtCfg = require('../config.json').jwt;


module.exports.isAuthenticated = async function(req, res, next){
    try{
        if(!req.cookies.GoodCat) return res.redirect('/login');
        let decoded = await Jwt.verifyToken(req.cookies.GoodCat);
        if(parseInt(decoded.data)!==req.session.passport.user)
            return next(new LocalError(401, '유효하지 않은 사용자 정보입니다.'));
        next();  
    }catch(err){
        return next(new LocalError(500, err.message || err));
    }
}