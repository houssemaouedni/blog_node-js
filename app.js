var createError = require("http-errors");
var express = require("express");
var session = require("express-session");
var path = require("path");
var cookieParser = require("cookie-parser");
const flash = require("connect-flash");
var logger = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
var indexRouter = require("./routes/index.router");
var usersRouter = require("./routes/users.router");
const User = require("./models/users.model");
const Article = require("./models/article.model");

var app = express();
mongoose
  .connect(
    "mongodb+srv://houssem:YroDvY7EQjtueulc@blog.wvaqf.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("connection ressuie"))
  .catch(() => console.log("Echec de connection"));

//init session
app.use(cookieParser("keyboard cat"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(
  session({
    secret: "houssem",
    resave: false,
    saveUninitialized: false,
  })
);
// init flash
app.use(flash());

// Init passport
app.use(passport.initialize());
app.use(passport.session());

// passport local mongoose
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
/**
 * sauvgarde des article sur local
 */
app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    Article.find({ author: req.user._id }, (err, articles) => {
      if (err) {
        console.log(err);
      } else {
        res.locals.articles = articles;
      }
      next();
    });
  } else {
    next();
  }
});

// Middlewares pour sauvgarder des donner en local;
app.use(function (req, res, next) {
  if (req.user) {
    res.locals.user = req.user;
  }
  res.locals.error = req.flash("error");
  res.locals.warning = req.flash("warning");
  res.locals.success = req.flash("success");
  res.locals.errorFromArticle = req.flash("errorFromArticle");
  res.locals.errorFromUser = req.flash("errorFromUser");
  res.locals.errorFromcategory = req.flash("errorFromcategory");
  next();
});

// prise en charge du/json
app.use(bodyParser.json());

// pris en charge du formulaire
app.use(bodyParser.urlencoded({ extended: false }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
module.exports = app;
