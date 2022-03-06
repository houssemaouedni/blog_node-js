var express = require('express');
const userControlleur = require('../controlleurs/user.controlleur');
const { guard } = require('../middlewares/guard');
const sendRestMail = require('../middlewares/service/email.service');
const loginValidator = require('../middlewares/validateur/login.validateur');
const resetValidator = require('../middlewares/validateur/reset.validateur');
const usersValidator = require('../middlewares/validateur/user.validateur');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* login */

router.get('/login', (req,res)=>{
  res.render('login');
} )

router.post('/login', loginValidator, userControlleur.login)

/**
 * Reset Password 
 */

router.get('/forget-password', (req, res)=>{
  res.render('forget-password')
})


router.post('/forget-password', userControlleur.resetPassword, sendRestMail)
/**
 * reset password (form)
 */

router.get('/reset-password/:token', userControlleur.resetPasswordForm)


router.post('/reset-password/:token', resetValidator, userControlleur.postResetPassword)

/* sign up */
router.get('/signup', (req,res)=>{
  res.render('signup');
} )
router.post('/signup', usersValidator, userControlleur.signup)
/**
 * dashboard
 */

router.get('/dashborad',  (req, res)=>{
  res.render('dashborad')
})
/**
 * Update Profil
 */

router.post('/save-profile', userControlleur.saveProfile)
/**
 * logout
 */
router.get('/logout', (req, res) =>{
  req.logout();
  req.flash('success', 'You are now disconnected !');
   return res.redirect('/')
})

module.exports = router;
