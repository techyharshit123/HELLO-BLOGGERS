const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
//Bringing User models
const User=require('../models/user')

router.get('/login',(req,res)=>{
    res.status(200).render('login.pug');
})

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/all_articles',
        failureRedirect: '/login',
        failureFlash: true
    })(req,res,next)
})

router.get('/register',(req,res)=>{
    res.status(200).render('register.pug');
})


router.post('/register',(req,res)=>{
   
    req.checkBody('name',"Name is required").notEmpty();
    req.checkBody('username',"Username is required").notEmpty();
    req.checkBody('password',"Password is required").notEmpty();
    req.checkBody('password2',"Password doesn't match").equals(req.body.password);
    req.checkBody('email',"Email is required").notEmpty();
    req.checkBody('college',"College name is required").notEmpty();
    if(req.body.email!='')
    {
        req.checkBody('email',"Email is not of correct format").isEmail();
    }

    let errors=req.validationErrors()

    if(errors)
    {
        res.status(200).render("register.pug",{
            errors:errors
        })
    }
    else
    {
        let user= new User()

        user.name=req.body.name;
        user.username=req.body.username;
        user.password=req.body.password;
        user.email=req.body.email;
        user.college=req.body.college;

        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                if(err)
                {
                    console.log(err)
                    return;
                }
                else
                {
                    user.password=hash;
                    user.save((err)=>{
                    if(err)
                    {
                        console.log(err)
                        return;
                    }
                    else
                    {
                        req.flash('success',"Registered successfully")
                        res.redirect('/login')
                    }
                  })
                }
            })
        })

       
        return;

    }


})

//Logout
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success','You are successfully logged out')
    res.redirect('/login')
})


//to access the router from outside
module.exports=router;