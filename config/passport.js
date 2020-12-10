const LocalStrategy=require('passport-local') //bringing passport-local for local authentication
const bcrypt = require('bcryptjs');  //Bringing bcrypt to compare passwords
const config = require('../config/database'); //bringing in database connection
const User = require('../models/user'); //Bringing in user model 

module.exports=function(passport){
    // implementing local strategy
    passport.use(new LocalStrategy(function(username,password,done)
        {
            //Matching username
            let query={username:username} //match username to username
            User.findOne(query,(err,user)=>{
                if(err)
                {
                    throw err;
                }
                if(!user)
                {
                    return done(null,false,{message:"No user found"})
                }

                //Comparing password
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err)
                    {
                        throw err;
                    }
                    if(isMatch)
                    {
                        return done(null,user);
                    }
                    else
                    {
                        return done(null,false,{message:"Password doen't match"});
                    }
                })

            })
        }))

        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });

        passport.deserializeUser(function(id, done) {
            User.findById(id, function(err, user) {
                done(err, user);
            });
        });
}
