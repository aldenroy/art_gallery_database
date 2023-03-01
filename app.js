var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
PORT = 15646;

//set up database file from connector
var db = require('./db-connector.js');


var exphbs = require('express-handlebars');
const { query } = require('express');
app.engine('.hbs', exphbs.engine({
    extname: ".hbs"
}));
app.set('view engine', '.hbs');

app.use(express.static('public'));

//render index
app.get('/', function (req, res) {
    res.render('index');
});

app.get('/patrons', function (req, res) {
    let query1 = "SELECT patron_id, first_name, last_name, email, address, is_artist FROM Patrons;";
    db.pool.query(query1, function (error, rows, fields) {
        res.render('patrons', { data: rows });
    })
});

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