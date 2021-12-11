const express = require('express');
const session = require('express-session');
const app = express();
const http = require('http').Server(app);
const PORT = process.env.PORT || 5001;
const path = require("path");
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
const Database = require('./lib/database')
const db = new Database('db/database.json')
const CSV = require('./lib/csv')
const csv = new CSV()

let adminAuth = 'password'

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

app.get('/welcome', (req, res) => {
 	res.render('form.ejs', { title : 'Let us know about you'});
});

app.get('/admin', isAuthenticated, (req, res) => {
 	res.render('admin.ejs', { title : 'Admin' });
});

app.get('/login', (req, res) => {
 	res.render('login.ejs', {title : 'Login'})
});

app.post('/submit', async (req, res) => {

	db.set(req.body.session, req.body)

	if(req.body.done){
		return res.json({ done : true })
	}
	return res.json({ success : true })
})

app.post('/csv', isAuthenticated, async (req, res) => {
	let database = db.readFile()
	let file = await csv.make(database)
	res.download(file)
	return
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