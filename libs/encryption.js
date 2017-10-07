const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const cryptoCfg = require('../config.json').crypto;

class Encryption{

    static hash(value){
        return new Promise((resolve, reject) => {
            bcrypt.hash(value, null, null, (err, result) => {
                if(err) reject(err);
                else resolve(result);
            });
        });
    }

    static compare(value, hashed){
        return new Promise((resolve, reject) => {
            bcrypt.compare(value, hashed, (err, result) => {
                if(err) reject(err);
                else resolve(result);
            });
        });
    }
    
    static encrypt(value){
        const cipher = crypto.createCipher(cryptoCfg.algorithm, cryptoCfg.secretKey);
        let encrypted = cipher.update(value, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    static decrypt(value){
        const decipher = crypto.createDecipher(cryptoCfg.algorithm, cryptoCfg.secretKey);
        let decrypted = decipher.update(value, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}

module.exports = Encryption;