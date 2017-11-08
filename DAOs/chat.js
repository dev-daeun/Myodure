const pool = require('../libs/mysql');


module.exports = {
    selectAll: async function(userId){
        try{
            var conn = await pool.getConnection();
            let results = await conn.query(
                `
                SELECT ROOM.*, MESSAGE.unread 
                FROM   (SELECT TALK.content, 
                        TALK.sender_id, 
                        TALK.sent_time, 
                        TALK.id, 
                        users.username 
                        FROM   (SELECT * 
                                FROM   talks 
                                WHERE  saler_id = ? 
                                OR adopter_id = ?) AS TALK 
                        JOIN users 
                        ON TALK.saler_id = users.id) AS ROOM 
                LEFT OUTER JOIN (SELECT Count(*) AS unread, 
                             talk_id 
                      FROM   talk_messages 
                      WHERE  sender_id != ? 
                             AND is_read = 0 
                      GROUP  BY talk_id) AS MESSAGE 
                  ON MESSAGE.talk_id = ROOM.id 
                `,
            [userId, userId, userId]);
            return results;
        }catch(err){
            throw err;
        }finally{
            await pool.releaseConnection(conn);
        }
    },
    selectByTalkId: async function(talkId){
        try{
            var conn = await pool.getConnection();
            let results = await conn.query('select * from talk_messages where talk_id = ? order by id desc', [talkId]);
            return results;

        }catch(err){
            throw err;
        }finally{
            await conn.releaseConnection();
        }
    }
}