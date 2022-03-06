const Category = require("../models/category.model");






exports.addCategory= (req, res ,next)=>{
    // const {title, description} = req.body;
    const newCategory = new Category({
        // title : title,
        // description: description
        ...req.body
    })
    newCategory.save((err,category)=>{
        if(err){
            console.log(err);
        }
        req.flash('success', 'Great, Category has been added !')
        res.redirect('/add-category')
    })

}