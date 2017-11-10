const pool = require('../libs/mysql');


module.exports = {
    insert: async function(postId, userId){
        try{
            var conn = await pool.getConnection();
            let results = await conn.query('insert into favorites set ?', {
                post_id: postId,
                user_id: userId
            });
            return results.insertId;
        }catch(err){
            throw err;
        }finally{
            await pool.releaseConnection(conn);
        }
    },
    delete: async function(postId, userId){
        try{
            var conn = await pool.getConnection();
            await conn.query('delete from favorites where post_id = ? and user_id = ?', [postId, userId]);
            return;
        }catch(err){
            throw err;
        }finally{
            await pool.releaseConnection(conn);
        }
    },
    select: async function(userId){
        try{
            var conn = await pool.getConnection();
            let result = await conn.query(`
            SELECT  posts.id, 
                    posts.title, 
                    posts.introduction, 
                    posts.created_at, 
                    posts.thumbnail
            FROM    posts 
            JOIN    favorites 
            ON      favorites.user_id = ?
            AND favorites.post_id = posts.id 
            ORDER  BY favorites.id DESC`, [userId]);
            return result;
        }catch(err){
            throw err;
        }finally{
            await pool.releaseConnection(conn);
        }
    }
};
