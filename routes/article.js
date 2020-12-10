const express = require('express')
const router = express.Router();

//Bringing Article models
const Article=require('../models/article')

router.get('/articles/add', (req, res) => {
    res.status(200).render('add_articles.pug',{
    title: 'Articles'
    }); 
})


router.post('/articles/add', (req, res) => {

    req.checkBody('title','Title is required').notEmpty(); /////////////////What does 1st argument points to///////////////////
    req.checkBody('author','Author is required').notEmpty();
    req.checkBody('body','Body is required').notEmpty();

    let errors = req.validationErrors()
     
    if(errors)
    {
        res.status(200).render('add_articles.pug',{
                title: 'Articles',
                // articles: articles,
                errors:errors
            });
    }
    else
    {
        let article = new Article();
    // console.log(req.body)
        article.title=req.body.title
        article.author=req.body.author
        article.body=req.body.body

        article.save((err)=>{
        if(err)
        {
            console.log(err)
            return;
        }
        else
        {
            req.flash('success', 'Article added')
            res.redirect('/all_articles');
        }
    })

    // console.log(req.body)
    return;

    }

    
    
})


router.get('/all_articles', (req, res) => {
    Article.find({},function(err,articles){
        if(err){
            console.log(err)
        }
        else
        {
            res.status(200).render('all_articles.pug',{
                title: 'Articles',
                articles: articles
            });
        }
    })
    
})
//Single article
router.get('/article/:id',(req,res)=>{
    Article.findById(req.params.id,function(err,article){
        res.render('article.pug',{
        article:article
    })
        return;
    })
})




//Edit the article
router.get('/article/edit/:id',(req,res)=>{
    Article.findById(req.params.id,function(err,article){

        res.render('edit_article.pug',{
        article:article
    })
        return;
    })
})

//update the single article
router.post('/article/edit/:id', (req, res) => {
    let article = {};
    // console.log(req.body)
    article.title=req.body.title
    article.author=req.body.author
    article.body=req.body.body

    let query = {_id:req.params.id}

    Article.update(query,article,(err)=>{
        if(err)
        {
            console.log(err)
            return;
        }
        else
        {
            req.flash('success', 'Article edited')
            res.redirect('/all_articles');
        }
    })
    // console.log(req.body)
    return;
    
})

//to access the router from outside
module.exports=router;