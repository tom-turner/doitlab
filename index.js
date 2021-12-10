const express = require('express');
const app = express();
const http = require('http').Server(app);
const PORT = process.env.PORT || 5000;
const path = require("path");
const expressLayouts = require('express-ejs-layouts');

app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.set('layout', 'application');
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index.ejs', { title : 'Do It LAB - A Do It LAB is a space for you to prototype physical products.'});
});

app.get('/qrcode', function (req, res) {
  res.render('onboarding.ejs', { title : 'Let us know about you'});
});

app.get('/suggestions', function (req, res) {
  res.redirect('https://airtable.com/shrL4dqHAP01zqy1y');
});

const server = http.listen(process.env.PORT || PORT, function() {
  console.log('listening on *:',PORT);
});