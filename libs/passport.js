const UserDAO = require('../DAOs/user');
const Encryption = require('./encryption');
const Jwt = require('../libs/jwt');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((userId, done) => {
    done(null, userId);
});

passport.deserializeUser(async (userId, done) => {
    let user = await UserDAO.selectByCol('id', userId);
   
    if(!user) return done();
    return done(null, userId);
   
});

passport.use(new LocalStrategy({ // local 전략을 세움
    usernameField: 'email',
    passwordField: 'password',
    session: true, // 세션에 저장 여부
    passReqToCallback: true,
  }, async (req, email, password, done) => {
      try{

        let result = await UserDAO.selectByCol('email', email);
        if(!result.length) return done(null, false, '존재하지 않는 아이디입니다.');
      
        let correct = await Encryption.compare(password, result[0].password);
        if(!correct) return done(null, false, '잘못된 패스워드입니다.' ); 
      
        return done(null, result[0].id);

      }catch(findError){
        return done(findError);
      }
    })
  );
  
module.exports = passport;