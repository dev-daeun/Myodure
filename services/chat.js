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
            
            return sender[0].username;
        }catch(err){
            conn.rollback();
            throw err;
        }finally{
            await pool.releaseConnection(conn);
        }
    }
}

module.exports = ChatService;