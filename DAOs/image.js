const pool = require('../libs/mysql');

module.exports = {
    insertBulk: async function(conn, images){
        try{
            await conn.query('insert into post_images(image, post_id) values ? ', [images]);
            return ;
        }catch(err){
            throw err;
        }
    }
}