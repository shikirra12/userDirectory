const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const passport = require('passport');

mongoose.connect('mongodb://localhost:27017/robots')

let data = [];

// let getData = function(db, callback) {
//   let users = db.collection("users");
//
//   users.find({}).toArray().then(function(users) {
//     data = users;
//     callback();
//   });
// };

const getListings = function(req, res, next){
  // let MongoClient = require("mongodb").MongoClient;
  // let assert = require("assert");
  //
  //
  // let url = "mongodb://localhost:27017/robots";
  //
  // MongoClient.connect(url, function(err, db) {
  //   assert.equal(null, err);
  //
  //   getData(db, function() {
  //     db.close();
  //     next();
  //   });
  // });
  User.find({}).sort('name')
  .then(function(users) {
    data = users;
    next();
  })
  .catch(function(err) {
    console.log(err);
    next(err);
  });
};

const requireLogin = function(req, res, next) {
  if(req.user){
    console.log('REQ USER',req.user);
    next();
  } else {
    res.redirect('/');
  }
};

const login = function(req, res, next) {
  if (req.user) {
    res.redirect('/index')
  } else {
    next();
  }
};

// cannot get password to serialize nor can i login in but the i can create a signup and reroute to the login page. login page will not post to the index page. need to allow user to edit their profile
router.get('/', login, function(req, res) {

  console.log(req.user);
  res.render('login');
});

router.post('/', login, passport.authenticate('local', {
  successRedirect: 'index',
  failureRedirect: '/',
  failureFlash: true
}))
//
// router.post('/', login, passport.authenticate('local', {
//   sucessRedirect: 'index',
//   failureRedirect: '/',
//   failureFlash: true
// }));

router.get('/signup', function(req, res) {
  res.render('signup');
});

router.post('/signup', function(req, res) {
  User.create({
    username: req.body.username ,
    password: req.body.password,
    name: req.body.name,
    email: req.body.email,
    university: req.body.university,
    job: req.body.job,
    company: req.body.company,
    skills: req.body.skills,
    phone: req.body.phone,
    address: {
      street_num: req.body.street_num,
      street_name:req.body.street_name,
      city: req.body.city,
      state_or_province: req.body.state_or_province,
      postal_code: req.body.postal_code,
      country: req.body.country
    }
  }).then(function(data) {
    console.log(data);
    res.redirect('/');
  })
  .catch(function(data) {
    console.log(err);
    res.redirect("/signup");
  });
});


router.get('/index', getListings, requireLogin, function(req, res) {

   console.log("/index");
  res.render('index', { users: data , loggedUser: req.user})
});


router.get('/unemployed', function(req, res) {
  let job = req.params.job;
  let unemployed = [];
  data.forEach(function(user) {
  if (user.job == null) {
    unemployed.push(user);
    // console.log(unemployed);
  }
  });
  res.render('unemployed', {users: unemployed})
});

router.get('/employed', function(req, res) {
  let job = req.params.job;
  let employed = [];
  data.forEach(function(user) {
    if (user.job != null) {
      employed.push(user);
      console.log(employed);
    }
  });
  res.render('employed', {users: employed})
});

router.get('/profile/:id', getListings, requireLogin, function(req, res) {
  let id = req.params.id;
  let userToRender;
  data.forEach(function(user) {
    if (user.id == id) {
      userToRender = user;
    }
  });
  console.log(userToRender);
  res.render('profile', {users: userToRender, loggedUser: req.user });
});


router.get('/edit/:id', getListings, requireLogin, function(req, res) {
  res.render('edit', {users: data, loggedUser: req.user})
});

// allow user to update their profile
router.put('/edit/:id', function(req, res) {
req.user.update({
  username: req.body.username ,
  password: req.body.password,
  name: req.body.name,
  email: req.body.email,
  university: req.body.university,
  job: req.body.job,
  company: req.body.company,
  skills: req.body.skills,
  phone: req.body.phone,
  address: {
    street_num: req.body.street_num,
    street_name:req.body.street_name,
    city: req.body.city,
    state_or_province: req.body.state_or_province,
    postal_code: req.body.postal_code,
    country: req.body.country
  }
}).then(function(data) {
  console.log(data);
  res.redirect('/profile');
})
.catch(function(data) {
  console.log(err);
  res.redirect('/edit');
});
});


router.get('/logout', function(req, res) {
  req.logout();
  // req.session.destroy();
  res.redirect('/');
});

module.exports = router;
