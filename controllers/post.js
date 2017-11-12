const PostDAO = require('../DAOs/post');
const PostService = require('../services/post');
const CustomError = require('../libs/error');
const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const multer  = require('multer');
const moment = require('moment');
const upload = require('../libs/s3').getUpload();

router.get('/', async function(req ,res ,next){
    try{
            let posts = await PostDAO.selectAll(req.session.passport.user);
                posts.forEach((element) => {
                    element.created_at = moment(element.created_at).format("YYYY.MM.DD");
                    if(element.favor_id==null) element.isFavor = 0;
                    else element.isFavor = 1;
                    delete element.favor_id;
                })
            ejs.renderFile('views/list.html', {posts: posts} ,(err, view) => {
                if(err) next(err);
                else res.status(200).send(view);
            });
    }catch(err){
        next(err);
    }

});

router.use(require('./auth').isAuthenticated);

router.get('/registration', async function(req, res, next){
    ejs.renderFile('views/register.html', (err, view)=>{
        if(err) next(err);
        else res.status(200).send(view);
    });
});

router.get('/:id', async function(req, res, next){
    try{
        let post = await PostDAO.selectById(req.params.id);
        if(post.length==0){
            ejs.renderFile('views/404.html', (err, view) => {
                if(err) next(err);
                else res.status(404).send(view);
            });
        }
        else{
            let images = new Array();
            for(let element of post) images.push(element.image);
           
            post[0].created_at = moment(post[0].created_at).format('YYYY.MM.DD');
            post[0].isOwnPost = (parseInt(post[0].user_id) === parseInt(req.session.passport.user)) ? true : false;
          
            console.log(post[0])
            ejs.renderFile('views/post.html', {post: post[0], images: images}, (err, view) => {
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
            for(let key in keys)
                if(!req.body[key]||req.body[key]=='') 
                    return next(new CustomError(400, keys[key]+"(를/을) 입력하세요.")); 


            let specification = req.body;
                specification.user_id = req.session.passport.user;
                specification.lineage = req.files.lineage ? req.files.lineage[0].location : null;
                specification.thumbnail = req.files.images[0].location;

            let imageArray = new Array();
            req.files.images.forEach( element => {
                imageArray.push([element.location]);
            });

            let newPostId = await PostService.postNew(specification, imageArray); 
            res.status(201).send(""+newPostId);             
        }catch(err){
            next(new CustomError(500, err.message || err));
        }
});


module.exports = router;

  
  