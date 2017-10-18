const express = require('express');
const app = express();
const ejs = require('ejs');
const { Pool } = require('pg');
const pool = new Pool({
      host: 'localhost',
      port: 3001,
      database: 'bulletinboarddb',
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD
});
const SQL = require('sql-template-strings');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded());

app.route('/')
    .get(function(req, res) {
        pool.query('SELECT * FROM messages', function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            res.render('./pages/index', {messages: result.rows});
        });
    }).post(function(req, res) {
        pool.query(SQL `INSERT INTO messages (title, body) VALUES (${req.body.title}, ${req.body.body})`, function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            res.redirect('/');
        });
    });

app.get('/add', function (req, res) {
        res.render('./pages/add');
    });

app.listen(3000, function() {
    console.log('Bulletin Board app started on port 3000');
});
