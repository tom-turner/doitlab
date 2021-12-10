const express = require('express');
const session = require('express-session');
const app = express();
const http = require('http').Server(app);
const PORT = process.env.PORT || 5000;
const path = require("path");
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose();

let adminAuth = 'password'
let dbFilePath = 'db/doitlab.db'
let db = new sqlite3.Database( dbFilePath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

app.use(bodyParser.json())
app.use(session({ secret: adminAuth}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.set('layout', 'application');
app.set('view engine', 'ejs');
app.use(express.urlencoded({
  extended: true
}))

let isAuthenticated = (req, res, next) => {
	let match = req.session.auth == adminAuth
	
	if(!match){
		return res.redirect('/login')
	}

	next()
}

app.get('/', (req, res) => {
	res.render('index.ejs', { title : 'Do It LAB - A Do It LAB is a space for you to prototype physical products.'});
});

app.get('/suggestions', (req, res) => {
  	res.redirect('https://airtable.com/shrL4dqHAP01zqy1y');
});

app.get('/qrcode', (req, res) => {
 	res.render('form.ejs', { title : 'Let us know about you'});
});

app.get('/admin', isAuthenticated, (req, res) => {
 	res.render('admin.ejs', { title : 'Admin'});
});

app.get('/login', (req, res) => {
 	res.render('login.ejs', {title : 'Login'})
});

app.post('/submit', (req, res) => {
	console.log('form submited', req.body)


	if(req.body.done){
		return res.json({ done : true })
	}
	return res.json({ success : true })
})

app.post('/session', (req, res) => {
	req.session.auth = req.body.password
	res.redirect('/admin')
})

app.post('/logout', (req, res) => {
	req.session.auth = ''
	res.redirect('/login')
})
	
const server = http.listen(process.env.PORT || PORT, function() {
  console.log('listening on *:',PORT);
});