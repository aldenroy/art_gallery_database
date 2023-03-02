var express = require('express');

//Create express app
var app = express();
PORT = 15646;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

//Serves stactic files like CSS from the public directory
app.use(express.static('public'));

//Loads handlebars module
var handlebars = require('express-handlebars');


app.engine('hbs', handlebars.engine({
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials/',
    extname: 'hbs'
}));
app.set('view engine', 'hbs');

//Set up database file from connector
var db = require('./database/db-connector.js');

//===== ROUTING =====

//REQUEST FOR INDEX PAGE
app.get('/', function (req, res) {
    res.render('index', {title: 'Home'});
});

//REQUESTS FOR ARTISTS PAGE
app.get('/artists', function (req, res) {

    //Defines a query to select all artists from the patron table
    let query1 = 'SELECT * FROM Patrons WHERE is_artist = 1';

    //Exicutes query
    db.pool.query(query1, function (err, results, fields){

        //Renders artist page with requested data
        res.render('artists', {title: 'Artists', data: results});
    });
});

//REQUESTS FOR FRAMES PAGE
app.get('/frames', function (req, res) {

    //defines query to select all Frames table 
    let query1 = 'SELECT * FROM Frames'

     //Exicutes query
     db.pool.query(query1, function (err, results, fields){

        //Renders frames page with requested data
        res.render('frames', {title: 'Frames', data: results});
    });
});

//REQUEST FOR ARTWORKS PAGE
app.get('/artwork', function (req, res) {

    //defines query to select all artworks table
    //NEED TO BE JOINED WITH ARTIST TABLE
    let query1 = 'SELECT * FROM Artworks'

     //Exicutes query
     db.pool.query(query1, function (err, results, fields){

        //Renders artwork page with requested data
        res.render('artwork', {title: 'Artwork', data: results});
    });
});

//REQUESTS FOR PATRONS PAGE
app.get('/patrons', function (req, res) {

    //Defines a query to select all people from the patron table
    let query1 = 'SELECT * FROM Patrons';

    db.pool.query(query1, function (err, results, fields){

        //Renders artist page with requested data
        res.render('patrons', {title: 'Patrons', data: results});
    });
});

//REQUEST FOR TRANSACTIONS PAGE
app.get('/transactions', function (req, res) {
    //Defines a query to select data reguarding each transaction
    let query1 = 'SELECT Transactions.date AS Transactions, Frames.price AS Frames FROM Transactions JOIN Transactions_Has_Frames ON Transaction.transaction_id = Transactions_Has_Frames.transaction_id JOIN Frames ON Frames.frame_id = Transactions_Has_Frames.frame_id';

    db.pool.query(query1, function (err, results, fields){

        //Renders artist page with requested data
        res.render('transactions', {title: 'Transactions', data: results});
    });
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