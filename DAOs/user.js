const pool = require('../libs/mysql');
const dbConfig = require('../config.json').database;

module.exports = {
    insert: async function(userDto){
        try {    
            var conn = await pool.getConnection();
            await conn.query('insert into users set ? ', userDto);
            return ;
        } catch(err) {
            throw err;
        } finally {
            await pool.releaseConnection(conn);
        }
    },
    selectByCol: async function(col, data){
        try {
            var conn = await pool.getConnection();
            let result = await conn.query('select * from users where ?? = ?', [col, data]);
            return result;
        } catch(err) {
            throw err;
        } finally {
            await pool.releaseConnection(conn);
        }
    },
    deleteById: async function(id){
        try {
            var conn = await pool.getConnection();
            await conn.query('delete from users where id = ?', [id]);
            return;
        } catch(err) {
            throw err;
        } finally {
            await pool.releaseConnection(conn);
        }
    }
};

