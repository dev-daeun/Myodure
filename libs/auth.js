const jwt = require('jsonwebtoken');
const jwtCfg = require('../config.json').jwt;
class Authorization{

    static generateToken(data){
        return new Promise((resolve, reject) => {
            jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),
                data: data
                }, 
                jwtCfg.cert, { 
                    algorithm: jwtCfg.algorithm 
                }, (err, token) => {
                    if(err) reject(err);
                    else resolve(token);
            });
        });
    }

    static verifyToken(token){
        return new Promise((resolve, reject) => {
            jwt.verify(token, jwtCfg.cert, (err, decoded) => {
                if(err) reject(err);
                else resolve(decoded);    
            });
        });
    }
}

module.exports = Authorization;