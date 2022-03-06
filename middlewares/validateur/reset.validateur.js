const { Validator } = require('node-input-validator');



const resetValidator = (req, res, next)=>{  
    const v = new Validator(req.body,{
        password: 'required',
        passwordConfirm: 'required|same:password',
        

    })
    v.check().then((matched)=>{
        if(!matched){
            //erreur
            console.log(v.errors);
            req.flash('errorFromUser', v.errors);
            return res.redirect('/users/'+req.path);
        }
        next(); 
    })
}

module.exports = resetValidator;