const pool = require('../libs/mysql');


module.exports = {
    selectAll: async function(talkId, readerId){
        try{
            var conn = await pool.getConnection();
            await conn.beginTransaction();
            await conn.query("update talk_messages set is_read = 1 where talk_id = ? and sender_id != ?", [talkId, readerId]);
           
            let results = await conn.query(`
            SELECT talk_messages.*, users.username 
            FROM   talk_messages 
            JOIN users 
            ON talk_messages.talk_id = ? AND users.id = talk_messages.sender_id `, [talkId]);
            await conn.commit();
            return results;
        }catch(err){
            await conn.rollback();
            throw err;
        }finally{
            await pool.releaseConnection(conn);
        }
    }
}