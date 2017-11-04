const pool = require('../libs/mysql');
const dbConfig = require('../config.json').database;

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
    delete: async function(favorId){
        try{
            var conn = await pool.getConnection();
            await conn.query('delete from favorites where id = ?', [favorId]);
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
                    posts.thumbnail,
                    favorites.id as favorId
            FROM   favorites, 
                    posts 
            WHERE  favorites.user_id = ?
                    AND favorites.post_id = posts.id 
            ORDER  BY favorites.id DESC 
            `, [userId]);
            return result;
        }catch(err){
            throw err;
        }finally{
            await pool.releaseConnection(conn);
        }
    }
};
