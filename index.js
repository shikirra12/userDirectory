const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const app = express();
const router = require('./routes/user.js');

app.engine('mustache', mustacheExpress());
app.set("views", path.join(__dirname, "views"));
app.set('views', './views');
app.set('view engine', 'mustache');
// app.set('index', 'index');

app.use(express.static(path.join(__dirname, "public")));

app.use(router);

app.listen(3000, function() {
  console.log("App is running!");
})

// params: lets you grab items from a request
// ex: req.params.id;
// req: request from client
// params: grabbing a dynamic routte
// id: is the property being grabbed
