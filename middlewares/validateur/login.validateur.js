const { Validator } = require('node-input-validator');



const loginValidator = (req, res, next)=>{  
    const v = new Validator(req.body,{
        username: 'required',
        password: 'required',
    })
    v.check().then((matched)=>{
        if(!matched){
            //erreur
            console.log(v.errors);
            req.flash('errorFromUser', v.errors);
            return res.redirect('/users/signup')
        }
        next(); 
    })
}

module.exports = loginValidator;