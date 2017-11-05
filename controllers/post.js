const PostDAO = require('../DAOs/post');
const CustomError = require('../libs/error');
const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const multer  = require('multer');
const moment = require('moment');
const upload = require('../libs/uploadImage').getUpload("cat");

router.get('/', async function(req ,res ,next){
    try{
        let page = req.query.page,
            posts = await PostDAO.selectAll(1);
            posts.forEach((element) => {
                element.created_at = moment(element.created_at).format("YYYY.MM.DD");
                if(element.favorId==null) element.favorId = 0;
            })
        ejs.renderFile('views/list.ejs', {posts: posts} ,(err, view) => {
            if(err) next(err);
            else res.status(200).send(view);
        });
    }catch(err){
        next(err);
    }

});


router.get('/registration', async function(req, res, next){
    ejs.renderFile('views/register.ejs', (err, view)=>{
        if(err) next(err);
        else res.status(200).send(view);
    });
});

router.get('/:id', async function(req, res, next){
    try{
        let post = await PostDAO.selectById(req.params.id);
        if(post.length==0){
            ejs.renderFile('views/404.ejs', (err, view) => {
                if(err) next(err);
                else res.status(404).send(view);
            });
        }
        else{
            let images = new Array();
            for(let element of post) images.push(element.image);
            console.log(images);
            post[0].created_at = moment(post[0].created_at).format('YYYY.MM.DD');
            ejs.renderFile('views/post.ejs', {post: post[0], images: images}, (err, view) => {
                if(err) next(err);
                else res.status(200).send(view);
            });
        }
    }catch(err){
        next(new CustomError(500, err.message || err));
    }

});

router.post('/',  upload.fields([{
    name: 'lineage',
    maxCount: 1
},{
    name: 'images',
    maxCount: 4
}]), async function(req, res, next){
        try{
            let keys = {
                        'title': "제목", 
                        'introduction': "고양이 소개", 
                        'age': "고양이 나이", 
                        'spiece': "묘종", 
                        'fee': "분양비"
            };
            // for(let key in keys)
            //     if(!req.body[key]||req.body[key]=='') 
            //         return next(new CustomError(400, keys[key]+"(를/을) 입력하세요.")); 

            let spec = req.body;
                spec.lineage = "https://s3.ap-northeast-2.amazonaws.com/good-cat/cat/cat1.jpg";
            let inserted = await PostDAO.insert(spec, [[
                null,
                "https://s3.ap-northeast-2.amazonaws.com/good-cat/cat/cat1.jpg"
            ],[
                null,
                "https://s3.ap-northeast-2.amazonaws.com/good-cat/cat/cat1.jpg"
            ]
        ]);
            res.status(201).send(""+inserted);             
        }catch(err){
            next(new CustomError(500, err.message || err));
        }
});


module.exports = router;

  
  