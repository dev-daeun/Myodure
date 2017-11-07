const redis = require('redis');
const redisCfg = require('../config.json').redis;
const client = redis.createClient({
    password: redisCfg.password
});

class Redis{

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