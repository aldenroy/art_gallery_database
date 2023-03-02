var express = require('express');

//Create express app
var app = express();
PORT = 15646;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

//serves stactic files like CSS from the public directory
app.use(express.static('public'));

//loads handlebars module
var handlebars = require('express-handlebars');


app.engine('hbs', handlebars.engine({
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials/',
    extname: 'hbs'
}));
app.set('view engine', 'hbs');

//set up database file from connector
var db = require('./db-connector.js');

//routing
app.get('/', function (req, res) {
    res.render('index', {title: 'Home'});
});

app.get('/artists', function (req, res) {
    res.render('artists', {title: 'Artists'});
});

app.get('/frames', function (req, res) {
    res.render('frames', {title: 'Frames'});
});

app.get('/artwork', function (req, res) {
    res.render('artwork', {title: 'Artwork'});
});

app.get('/patrons', function (req, res) {
    res.render('patrons', {title: 'Patrons'});
});

app.get('/transactions', function (req, res) {
    res.render('transactions', {title: 'Transactions'});
});

const { query } = require('express');


//Things Connor hasn't wrapped his head around

// app.get('/patrons', function (req, res) {
//     let query1 = "SELECT patron_id, first_name, last_name, email, address, is_artist FROM Patrons;";
//     db.pool.query(query1, function (error, rows, fields) {
//         res.render('patrons', { data: rows });
//     })
// });

app.post('/add-patron-set-form', function (req, res) {
    let data = req.body;
    let query1 = `INSERT INTO Patrons (first_name, last_name, email, address) \
                    VALUES ('${data.inputFirstName}', '${data.inputLastName}', '${data.inputEmail}', '${data.inputAddress}')`
    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                res.sendStatus(401);
            }
            else {
                console.log(error);
                res.sendStatus(400);
            }
        }
        else {
            let query2 = 'SELECT patron_id, first_name, last_name, email, address, is_artist FROM Patrons';
            db.pool.query(query2, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    });
});










app.listen(PORT, function () {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});