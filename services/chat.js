const Msg = require('../DAOs/message');
const Chat = require('../DAOs/chat');
const User = require('../DAOs/user');
const pool = require('../libs/mysql');

class ChatService { /* TODO : conn 직접 접근 안하는 방법 없나(dao나 마찬가지) */
    static async sendMessage(senderId, talkId, msg, sentTime){
        try{
            var conn  = await pool.getConnection();
            await conn.beginTransaction();

            await Msg.insert(conn, senderId, talkId, msg, sentTime);
            await Chat.update(conn, senderId, talkId, msg, sentTime);
            let sender = await User.selectByCol("id", senderId);
            
            await conn.commit();
            
            return { username: sender[0].username, senderId: sender[0].id };
        }catch(err){
            conn.rollback();
            throw err;
        }finally{
            await pool.releaseConnection(conn);
        }
    }

    static async startChat(salerId, adopterId){
        try{
            let talkId;
            var conn = await pool.getConnection();
            await conn.beginTransaction();

            let exist = await Chat.selectByUsersId(conn, salerId, adopterId);
            if(exist.length>0) talkId = exist[0].id;
            else {
                let newRoom = await Chat.insert(conn, salerId, adopterId); 
                talkId = newRoom.insertId;
            }
            await conn.commit();
            return talkId;
        }catch(err){
            conn.rollback();
            throw err;
        }finally{
            pool.releaseConnection(conn);
        }
    }
}

module.exports = ChatService;