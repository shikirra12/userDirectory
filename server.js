const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const router = require('./routes/index.js');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('express-flash-messages');
const User = require('./models/user');

const app = express();

app.engine('mustache', mustacheExpress());
app.set("views", path.join(__dirname, "views"));
app.set('views', './views');
app.set('view engine', 'mustache');
// app.set('index', 'index');
// app.set('login', 'login');



app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(morgan('dev'));

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.authenticate(username, password, function(err, user) {
      if (err) {
        return done(err)
      }
      if (user) {
        return done(null, user)
      } else {
          return done(null, false, {
            message: "There is no user with that username and password."
          })
      }
    })
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
})

app.use(session({
  secret: 'koolkat',
  resave: false,
  saveUninitialized: false,
  store: new(require('express-sessions'))({
    storage: 'mongodb'
  })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(router);

app.listen(3000, function() {
  console.log("App is running!");
})

// params: lets you grab items from a request
// ex: req.params.id;
// req: request from client
// params: grabbing a dynamic routte
// id: is the property being grabbed
