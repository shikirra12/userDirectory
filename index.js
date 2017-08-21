const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const app = express();
const data = require('./data');

app.engine('mustache', mustacheExpress());
app.set('views', './public/views');
app.set('view engine', 'mustache');

app.use(express.static('public'))

app.get('/', function(req, res) {
  res.render('index', data)
});

app.get('/user/:id', function(req, res) {
  let id = req.params.id;
  let user = data.users.find(function(user) {
    return user.id == id;
  });
  // let id = req.params.id;
  // console.log(id);
  // data.users[req.params.id-1]
  res.send('listing', user);
})

app.listen(3000, function() {
  console.log("App is running!");
})

// params: lets you grab items from a request
// ex: req.params.id;
// req: request from client
// params: grabbing a dynamic routte
// id: is the property being grabbed
