const express = require('express')
const path = require('path')
const fs = require('fs')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const messages = require('express-messages')
const session = require('express-session')
// const Article = require('./models/article')



//Bringing models
const Article=require('./models/article')



//Initialise app
const app = express();
const port=80;


//connecting mongodb
mongoose.connect('mongodb://localhost/new')
const db=mongoose.connection;


//Checking for errors
db.on('error',function(err){
    console.log(err);
})


//Check connection
db.once('open',function(){
    console.log('Connected to MongoDB')
})






// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static files
app.use(express.urlencoded()) //to save the data as object



//PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', path.join(__dirname, 'views')) // Set the views directory


//////////Express session middleware//////////
// var app = express()
// app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))


////////Express message validator///////
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});





//Routes
app.get('/home', (req, res) => {
    Article.find({},function(err,articles){
        if(err){
            console.log(err)
        }
        else
        {
            res.status(200).render('home.pug',{
                title: 'Articles',
                articles: articles
            });
        }
    })
    
})
app.get('/articles/add', (req, res) => {
    Article.find({},function(err,articles){
        if(err){
            console.log(err)
        }
        else
        {
            res.status(200).render('add_articles.pug',{
                title: 'Articles',
                articles: articles
            });
        }
    })
    
})


app.post('/articles/add', (req, res) => {
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
    
})


app.get('/all_articles', (req, res) => {
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
app.get('/article/:id',(req,res)=>{
    Article.findById(req.params.id,function(err,article){
        res.render('article.pug',{
        article:article
    })
        return;
    })
})




//Edit the article
app.get('/article/edit/:id',(req,res)=>{
    Article.findById(req.params.id,function(err,article){

        res.render('edit_article.pug',{
        article:article
    })
        return;
    })
})

//update the single article
app.post('/article/edit/:id', (req, res) => {
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
            res.redirect('/all_articles');
        }
    })
    // console.log(req.body)
    return;
    
})

// START THE SERVER
app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});