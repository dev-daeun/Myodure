const pool = require('../libs/mysql');
const dbConfig = require('../config.json').database;
const postDAO = new Object();

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
    }
};
