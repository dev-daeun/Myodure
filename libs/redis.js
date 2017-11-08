const redisCfg = require('../config.json').redis;
const redis = require('redis');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const client = redis.createClient({
    password: redisCfg.password
});

class Redis{

    static getRedisSession() {
        return new redisStore({ 
            host: redisCfg.host, 
            port: redisCfg.port, 
            client: client
        });
    }
       
    static setValue(key, value, expiredTime){
        return new Promise((resolve, reject) => {
            client.set(key, value, "EX", expiredTime, (err) => {
                if(err) reject(err);
                else resolve();
            });
        });
    }

    static getValue(key){
        return new Promise((resolve, reject) => {
            client.get(key, (err, result) => {
                if(err) reject(err);
                else resolve(result);
            });
        });
    }

    static deleteValue(key) {
        return new Promise((resolve, reject) => {
            client.del(key, (err) => {
                if (err) reject(err);
                else resolve();
          });
        });
      }
}

module.exports = Redis;