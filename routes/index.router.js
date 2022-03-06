var express = require("express");

const articleControlleur = require("../controlleurs/article.controlleur");
const articleValidator = require("../middlewares/validateur/article.validateur");
const multerConfig = require("../middlewares/multer.config");
const { guard } = require("../middlewares/guard");
const categoryValidator = require("../middlewares/validateur/categorie.validateur");
const categoryControlleur = require('../controlleurs/category.controlleur');

var router = express.Router();

/* GET home page. */
router.get("/", articleControlleur.listArticle);
// res.render('index', { title: 'Express' });

router.get("/article/:id", articleControlleur.showArticle);

router.get('/add-article', guard, articleControlleur.addArticle);

router.post('/add-article', multerConfig , articleValidator, guard, articleControlleur.addOneArticle)

router.get("/edit-article/:id", guard, articleControlleur.editArticle)

router.post("/edit-article/:id", multerConfig, guard, articleControlleur.editOneArticle)

router.get("/delete-article/:id", guard, articleControlleur.deleteArticle)

router.get("/add-category", guard, (req, res) =>{
    res.render("add-category");
} )
router.post('/add-category',guard, categoryValidator, categoryControlleur.addCategory)
module.exports = router;
