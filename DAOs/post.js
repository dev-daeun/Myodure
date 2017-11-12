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
    selectAll: async function(userId){
        try{
            var conn = await pool.getConnection();
            let results = await conn.query(
                `SELECT * 
                 FROM  (SELECT posts.id, 
                               thumbnail, 
                               title, 
                               introduction, 
                               spiece, 
                               age, 
                               posts.gender, 
                               username 
                        FROM   posts 
                               JOIN users 
                                 ON posts.user_id = users.id 
                        ORDER  BY posts.id DESC) AS POST 
                        LEFT OUTER JOIN (SELECT post_id AS favor_id 
                                        FROM   favorites 
                                        WHERE  user_id = ?) AS FAVOR 
                        ON FAVOR.favor_id = POST.id
                order by POST.id desc`, [userId]);
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
    },
    insert: async function(conn, spec){
        try{
            let newPost = await conn.query('insert into posts set ? ', spec);
            console.log(newPost);
            return newPost.insertId;
        }catch(err){
            throw err;
        }
    },
    deleteById: async function(id){
        try{
            var conn = await pool.getConnection();
            await conn.query("delete from posts where id = ?", [id]);
            return;
        }catch(err){
            throw err;
        }finally{
            await pool.releaseConnection(conn);
        }
    }
};
