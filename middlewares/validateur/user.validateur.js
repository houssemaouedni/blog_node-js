const { Validator } = require('node-input-validator');



const userValidator = (req, res, next)=>{  
    const v = new Validator(req.body,{
        username: 'required',
        firstname: 'required',
        lastname: 'required',
        email: 'required',
        password: 'required',
        passwordConfirm: 'required|same:password',
        

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

module.exports = userValidator;