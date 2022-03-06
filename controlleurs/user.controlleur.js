const passport = require('passport')
const User = require('../models/users.model')
const randomToken = require('random-token');
const Reset = require('../models/reset.model');
// const bcrypt = require('bcrypt');

module.exports = {
  login: (req, res) => {

    const user = new User({
      username : req.body.username,
      password : req.body.password
    })

    req.login(user, (err)=>{
      if(err){
        req.flash('error', err.message)
        return res.redirect('/users/login')
      }
      passport.authenticate("local", {failureRedirect:'/users/login', failureFlash:"Invalid username or password"})(req, res, (err, user)=>{
        if(err){
          req.flash('error', err.message)
          return res.redirect('/users/login')
        }
        req.flash('success', 'Cool, your are now connected');
        return res.redirect('/users/dashborad')
      })
    })
    
    
  },
  
  //-------------Inscription avec Package Passport.js--------------------//
  signup: (req, res, next) => {
        const newUser = User({
          username : req.body.username,
          firstname : req.body.firstname,
          lastname : req.body.lastname,
          email : req.body.email
        })

        User.register(newUser, req.body.password , (err, user)=>{
          if(err){
            req.flash('error', err.message)
            return res.redirect('/users/signup')
          }
          //authentification
          passport.authenticate("local")(req,res, (err, newUser)=>{
            if(err){
              req.flash('error', err.message)
              return res.redirect('/users/signup')
            }
            req.flash('success', 'Your account has been successfully created. you can log in');
            return res.redirect('/users/dashborad')
          })
        })
  },
  resetPassword: (req, res, next) =>{
    User.findOne({username : req.body.username} , (err,user)=>{
      if(err){
        req.flash('error', err.message);
        return res.redirect('/users/forget-password');
      }
      if(!user){
        req.flash('error', 'Username not Found !');
        return res.redirect('/users/forget-password');
      }
      // creation de Token
      const token = randomToken(32);
      const reset = new Reset({
        username : req.body.username,
        resetPasswordToken : token,
        resetExpires : Date.now() + 3600000
      })
      reset.save((err,reset)=>{
        if(err){
          req.flash('error', err.message);
        return res.redirect('/users/forget-password');
        }
        //email de réinisialisation
        req.body.email = user.email
        req.body.message = "<h2> Hello "+user.username+"<h2> <br> Click this link to reset your password : <br>"+req.protocol+"://"+req.get('host')+"/users/reset-password/"+token;
        next();
      })
    })
  },
  resetPasswordForm: (req, res, next)=>{
    const token = req.params.token;
    Reset.findOne({resetPasswordToken: token, resetExpires: {$gt:Date.now()}}, (err, reset)=>{
      if(err){
        req.flash('error', err.message);
        return res.redirect('/users/forget-password');
      }
      if(!reset){
        req.flash('error', 'Your token is invalid. Please enter your Username ans ask again !');
        return res.redirect('/users/forget-password');
      }
      req.flash('success', 'Please reset your Password');
        return res.render('reset-password');
    })
  },
  postResetPassword: (req, res, next)=>{
    const token = req.params.token;
    const password = req.body.password;
    Reset.findOne({resetPasswordToken: token, resetExpires: {$gt:Date.now()}}, (err, reset)=>{
      if(err){
        req.flash('error', err.message);
        return res.redirect('/users/forget-password');
      }
      if(!reset){
        req.flash('error', 'Your token is invalid. Please enter your Username ans ask again !');
        return res.redirect('/users/forget-password');
      }
      User.findOne({username: reset.username}, (err,user)=>{
        if(err){
          req.flash('error', err.message);
          return res.redirect('/users/forget-password');
        }
        if(!user){
          req.flash('error', err.message);
          return res.redirect('/users/forget-password');
        }
        user.setPassword(password, (err)=>{
          if(err){
            req.flash('error','You can\'t change password. Please enter your username again ');
            return res.redirect('/users/forget-password');
          }
          user.save();

          Reset.deleteMany({username: user.username}, (err,message)=>{
            if(err){
              console.log(err);
            }
            console.log(message);

          })
        })
      })

      req.flash('success', 'Your password has been updated. You can now login !');
        return res.redirect('/users/login');
    })
  },
  saveProfile: (req, res, next)=>{
    if(!req.user){
          req.flash('warning', 'Please login to modify your profile !');
          return res.redirect('/users/login')
    }
    if(req.user._id != req.body.userId){
      req.flash('error', 'You do not have right to modify your profile !');
        return res.redirect('/users/dashborad');
    }
    User.findOne({_id: req.body.userId},(err,user)=>{
      if(err){
        console.log(err);
      }
      const password = req.body.password
      const oldUsername = user.username
      user.firstname = req.body.firstname ? req.body.firstname : user.firstname;
      user.lastname = req.body.lastname ? req.body.lastname : user.lastname;
      user.username = req.body.username ? req.body.username : user.username;
      user.email = req.body.email ? req.body.email : user.email;
      user.setPassword(password, (err)=>{
        if(err){
          req.flash('error','You can\'t change password. Please enter your username again ');
        }
        user.save((err,user)=>{
          if(err){
            req.flash('error', 'An error has occurred. Please try again !');
            return res.redirect('/users/dashborad');
          }
        })
      })
      if(oldUsername != user.username){
        req.flash('success', 'You username has been changed successfully and you have been logged out. please reconnect username : '+req.body.username);
        return res.redirect('/users/login');
      }

      req.flash('success', 'You profile has been updated !');
        return res.redirect('/users/dashborad');
    })

  }
}

//-------------Inscription en mode natif--------------------//
// module.exports = {
// login: () => {
    
//   },

//   signup: (req, res, next) => {
//     bcrypt.hash(req.body.password, 10, (err, hash)=> {
//       if(err){
//         req.flash('error', err.message);
//         return res.redirect('/users/signup')
//       }
//       const newUser = User({
//           ...req.body,
//           password: hash
//       });
//       newUser.save((err,user)=>{
//         if(err){
//           req.flash('error', err.message);
//           return res.redirect('/users/signup')
//         }
//         req.flash('success', 'Your account has been successfully created. you can log in');
//           return res.redirect('/users/login')
//       })
//       console.log(newUser);
//     });

//   }
// };
