const pool = require('../libs/mysql');


module.exports = {
    selectUrgent: async function(){
        try{
            var conn = await pool.getConnection();
            let results = await conn.query('select id, thumbnail, title, introduction from posts where completed = 0 order by id limit 6');
            return results;
        }catch(err){
            throw err;
        }finally{
            await pool.releaseConnection(conn);
        }
    },
    selectAll: async function(){
        try{
            var conn = await pool.getConnection();
            let results = await conn.query(
                `select posts.id, thumbnail, title, introduction, spiece, age, posts.gender, username 
                from posts join users 
                on posts.user_id = users.id 
                order by posts.id desc`);
            return results;
        }catch(err){
            throw err;
        }finally{
            await pool.releaseConnection(conn);
        }
    },
    selectById: async function(id){
        try{
            var conn = await pool.getConnection();
            let results = await conn.query(
                `
                SELECT * 
                FROM   (SELECT posts.*, 
                               users.username 
                        FROM   posts 
                               JOIN users 
                                 ON users.id = posts.user_id 
                                    AND posts.id = ?)AS POSTS 
                       JOIN post_images 
                         ON post_images.post_id = POSTS.id 
                `, [id]);
            return results;
        }catch(err){
            throw err;
        }finally{
            await pool.releaseConnection(conn);
        }
    }
};
