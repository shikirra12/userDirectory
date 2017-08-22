const express = require('express');
const router = express.Router();

let data = [];

let getData = function(db, callback) {
  let users = db.collection("users");

  users.find({}).toArray().then(function(users) {
    data = users;
    callback();
  });
};

const getListings = function(req, res, next){
  let MongoClient = require("mongodb").MongoClient;
  let assert = require("assert");

  let url = "mongodb://localhost:27017/robots";

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);

    getData(db, function() {
      db.close();
      next();
    });
  });
};

router.get('/', getListings, function(req, res) {
  res.render('index', { users: data})
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

router.get('/profile/:id', getListings, function(req, res) {
  let id = req.params.id;
  let userToRender;
  data.forEach(function(user) {
    if (user.id == id) {
      userToRender = user;
    }
  });
  console.log(userToRender);
  res.render('profile', {users: userToRender});
});




module.exports = router;
