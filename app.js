const express = require('express')
const path = require('path')
const fs = require('fs')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const session = require('express-session')
const config = require('./config/database')
const passport = require('passport');





//Bringing models
const Article=require('./models/article')
const User=require('./models/user')



//Initialise app
const app = express();
const port=80;


//connecting mongodb
mongoose.connect(config.database)
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

// app.use(bodyParser.urlencoded({ extended: false })); 
// app.use(bodyParser.json());


//////////Express validator/////////
app.use(expressValidator()); //Express@5.3.1 works and latest not works


//Passport config
require('./config/passport')(passport)
//Middleware to initialize passport
 app.use(passport.initialize());
 app.use(passport.session()); //persistent login sessions

app.get('*',function(req,res,next){
  res.locals.user=req.user ||null  //Declaring global object "user"
  next();//to call next piece of middleware
})

//////////Express session middleware//////////
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))



////////Express message///////
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});






//Routes
app.get('/home', (req, res) => {
            res.status(200).render('home.pug',{
                title: 'Articles'
            });
})

//Bringing the routes files
const article=require('./routes/article.js')
app.use('/',article)
const user=require('./routes/user.js')
app.use('/',user)


// START THE SERVER
app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});