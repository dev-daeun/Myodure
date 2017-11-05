const coolsms = require('coolsms');
const smsConfig = require('../config.json').coolsms;

module.exports = function(reciever){
    return new Promise((resolve, reject) => {
        const number = Math.floor(Math.random() * (999999 - 100000) + 1);
        coolsms({
            ssl: false,            // true | false 
            user: smsConfig.username,     // CoolSMS username 
            password: smsConfig.password, // CoolSMS password 
            to: reciever,    // Recipient Phone Number 
            from: smsConfig.from,  // Sender Phone Number 
            text: '[묘두레] 인증번호는 '+number+'입니다.',  // Text to send 
            }, function(err, result) {
            // error message in String and result information in JSON 
                if (err) reject(err);
                else resolve(number.toString());
        });
    });
};
