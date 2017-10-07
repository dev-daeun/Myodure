const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const PostDAO = require('../DAOs/post');
const PostDTO = require('../DTOs/post');

router.get('/', async function(req ,res ,next){
    try{
        let page = req.query.page;
        let posts = await PostDTO.getPostsByPage(page);
        console.log(posts);
        ejs.renderFile('views/list.ejs', {posts: posts} ,(err, view) => {
            if(err) next(err);
            else res.status(200).send(view);
        });
    }catch(err){
        next(err);
    }

});

router.use(require('./auth'));

router.get('/:id', async function(req, res, next){
    ejs.renderFile('views/posts.ejs', (err, view) => {
        if(err) next(err);
        else res.status(200).send(view);
    });
});

router.post('/', async function(req, res, next){
    
});
module.exports = router;