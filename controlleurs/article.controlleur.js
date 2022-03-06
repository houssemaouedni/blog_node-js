const { router } = require("../app");
const Article = require("../models/article.model");
const Category = require("../models/category.model");
const fs = require('fs');
const User = require('../models/users.model');

exports.listArticle = (req, res) => {
  Article.find()
    .then((articles) => {
      res.render("index", { title: "Express", articles: articles });
    })
    .catch((err) => {
      // res.status(200).json(err);
    });
};

exports.showArticle = (req, res) => {
  Article.findOne({ _id: req.params.id })
    .then((article) => {
      res.render("single-article", { article: article });
    })
    .catch((err) => {
      res.redirect("/");
    });
};
exports.addArticle = (req, res) => {
  Category.find()
    .then((category) => {
      res.render("add-article", { category: category });
    })
    .catch(() => {
      res.redirect("/");
    });
};

exports.addOneArticle = (req, res) => {
  var article = new Article({
    ...req.body,
    image: `${req.protocol}://${req.get("host")}/images/article/${
      req.file.filename
    }`,
    author: req.user,
    publishedAt: Date.now(),
  });
  article.save((err, article) => {
    if (err) {
      req.flash("error", "merci de ajouter une photo");
      return res.redirect("/add-article");
    } else {
      req.flash("success", "Thank you, your article has been added");
      return res.redirect("/");
    }
  });
};
exports.editArticle = (req, res) => {
  const id = req.params.id;
  Article.findOne({_id:id , author: req.user._id}, (err, article) => {
    if (err) {
      req.flash("error", error.message);
      return res.redirect("/");
    }
    if(!article){
      req.flash('error', 'Sorry, you can\'t edite this article !')
      return res.redirect('/');
    }
    Category.find((err, category) => {
      if (err) {
        req.flash("error", error.message);
        return res.redirect("/");
      }
      res.render('edit-article', {category: category, article: article});
    });
  });
};
exports.editOneArticle = (req, res) =>{
  const id = req.params.id;
  Article.findOne({_id:id, author: req.user._id}, (err, article) =>{
    if(err){
      req.flash('error', err.message)
      return res.redirect('/edit-article/'+id);
    }
    if(!article){
      req.flash('error', 'Sorry, you can\'t edite this article !')
      return res.redirect('/');
    }
    if(req.file){
      const filename = article.image.split('/article/')[1]
      fs.unlink(`public/images/article/${filename}`,()=>{
        console.log('deleted: '+filename);
      })
    }
    article.title =req.body.title ? req.body.title : article.title;
    article.category =req.body.category ? req.body.category : article.category;
    article.content =req.body.content ? req.body.content : article.content;
    article.image = req.file ? `${req.protocol}://${req.get("host")}/images/article/${req.file.filename}`:article.image ;

    article.save((err, article)=>{
      if(err){
        req.flash('error', err.message)
      return res.redirect('/edit-article/'+id);
      }
      req.flash("success", "Cool, your article has been edited");
      return res.redirect('/edit-article/'+id);
    })
  })

}
exports.deleteArticle =(req, res)=>{

  Article.deleteOne({_id: req.params.id, author: req.user._id}, (err,message)=>{
    if(err){
      req.flash("error", "Sorry, You can\'t delete this article !");
      return res.redirect("/users/dashborad");
    }
    if(!message.deletedCount){
      req.flash("error", "Sorry, You can\'t delete this article !");
      return res.redirect("/users/dashborad");

    }
    console.log(message);
    req.flash("success", "The article has been deleted !");
      return res.redirect("/users/dashborad");

  })
}
