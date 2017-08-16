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

app.get('/listing/:id', function(req, res) {
  console.log(req.param.id);
  // let id = req.params.id;
  // console.log(id);
  res.send('listing', data.users[req.params.id-1]);
})

app.listen(3000, function() {
  console.log("App is running!");
})
