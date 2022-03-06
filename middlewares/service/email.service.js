const nodemailer = require('nodemailer');

const sendRestMail = (req,res)=>{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: 'houssem.netflix1@gmail.com',
            pass: 'Ha11059586'
        }
    });
    var message = "<br> Message : "+req.body.message;
    var mailOptions ={
        form: 'houssem.netflix1@gmail.com',
        to: req.body.email,
        subject: "Reset your Password",
        text: message,
    };

    transporter.sendMail(mailOptions, (err,infos)=>{
        if(err){
            req.flash('error', err.message);
            return res.redirect('/users/forget-password');
        }else{
              console.log(infos);
              req.flash('success', 'Great, a reset email has been sent to the address : '+req.body.email+'.please check your mail ans click on the reset link');
              return res.redirect('/users/forget-password');
        }
    })
}

module.exports = sendRestMail;