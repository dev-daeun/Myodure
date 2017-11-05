const LocalError= require('../libs/error');
const User = require('../services/user');
const Jwt = require('../libs/jwt');
const jwtCfg = require('../config.json').jwt;


module.exports.isloggedIn = async function(req, res, next){
    try{
        if(!req.session.token) next(new LocalError(400, "로그인을 해주세요."));
        else {
            let decoded = await Jwt.verifyToken(req.session.token); //토큰 분해
            if(!decoded) next(new LocalError(400, "재로그인 해주세요.")); //로컬 키로 만들어진 게 아니면
            let result = await User.checkDup("id", decoded.data);
            if(!result) next(new LocalError(400, "없는 회원정보로 로그인 중입니다. 재로그인 해주세요."));
            else {
                req.id = decoded.data;
                next();
            };
        }
    } catch(err){
        next(err);
    }
}




module.exports.isAuthenticated = async function(req, res, next){
    try{
        if(!req.cookies.GoodCat) return res.redirect('/login');
        let decoded = Jwt.verify(req.cookies.GoodCat);
        if(parseInt(decoded)!==req.session.passport.user);
        return next(new CustomError(401, '유효하지 않은 사용자 정보입니다.'));
        next();  
    }catch(err){
        return next(new CustomError(500, err.message || err));
    }
}