const Encryption = require('../libs/encryption');
const UserDAO = require('../DAOs/user');
class UserService{

    static async signup(user){
        try{
            let hashedPw = await Encryption.hash(user.password);
            let encryptedPhone = Encryption.encrypt(user.phone);
            
            user.password = hashedPw;
            user.phone = encryptedPhone;
            let result = await UserDAO.insert(user);
            return result;
        }catch(err){
            throw err;
        }
    }

    static async checkDup(col, data){
        try{           
           let result = UserDAO.selectByCol(col, data);
           if(result.length>0) return true;
           else return false;
        }catch(err){
            throw err;
        }
    }

    static async login(email, password){
        try{
            let result = await UserDAO.selectByCol("email", email);
            if(result.length==0) return false;
            else{
                let rightPw = await Encryption.compare(password, result[0].password);
                if(!rightPw) return false;
                else return result[0].id;
            }
        }catch(err){
            throw err;
        }
    }
}

module.exports = UserService;