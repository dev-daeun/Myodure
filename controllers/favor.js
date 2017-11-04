const FavorDAO = require('../DAOs/favor');
const PostDAO = require('../DAOs/post');
const CustomError = require('../libs/error');

const moment = require('moment');
const express = require('express');
const router = express.Router();
const ejs = require('ejs');

router.get('/', async function(req, res, next){
    try{
        let result = await FavorDAO.select(1);
        result.forEach((element) => {
            element.created_at = moment(element.created_at).format('YYYY.MM.DD');
        });
        ejs.renderFile('views/list.ejs', {posts: result} ,(err, view) => {
            if(err) next(err);
            else res.status(200).send(view);
        });
    }
    catch(err){
        return next(new CustomError(500, err.message || err));
    }
});

router.post('/', async function(req, res, next){
    try{
        let post = await PostDAO.selectById(req.body.postId);
        if(post.length==0) return next(new CustomError(404, "해당 글을 찾을 수 없습니다."));
        let result = await FavorDAO.insert(req.body.postId, 1);
        res.status(201).send(result);
    }
    catch(err){
        return next(new CustomError(500, err.message || err));
    }
});

router.delete('/', async function(req, res, next){
    try{
        let post = await PostDAO.selectById(req.body.postId);
        if(post.length==0) return next(new CustomError(404, "해당 글을 찾을 수 없습니다."));
        let result = await FavorDAO.delete(req.body.favorId, 1);
        res.status(200).send(true);
    }
    catch(err){
        return next(new CustomError(500, err.message || err));
    }
});

module.exports = router;