var express = require('express');

//Create express app
var app = express();
PORT = 15649;

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

//NOT SURE WE ACTUALLY NEED THIS
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

app.post('/add-patron-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    query1 = `INSERT INTO Patrons (first_name, last_name, email, address) VALUES ('${data['input-fname']}', '${data['input-lname']}', '${data['email']}', '${data['address']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/patrons');
        }
    })
})

// Citation for the following code:
// Date: 2023/03/02
// Copied and adapted from OSU GitHub (osu-cs340-ecampus) project (Dynamically Deleting Data)
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data

app.delete('/delete-person-ajax/', function(req,res,next){
    let data = req.body;
    let personID = parseInt(data.id);
    let deleteBsg_Cert_People = `DELETE FROM Patrons WHERE patron_id = ?`;
    // let deleteBsg_People= `DELETE FROM bsg_people WHERE id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteBsg_Cert_People, [personID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                res.sendStatus(204);
              }
  })});


  app.put('/put-person-ajax', function(req,res,next){
    let data = req.body;
  
    let first_name = data.first_name
    let last_name = data.last_name
    let email = data.email
    let address = data.address
    let patron_id = data.patron_id
  
    let queryUpdateInfo = `UPDATE Patrons SET first_name = ?, last_name = ?, email = ?, address = ? WHERE Patrons.patron_id = ?`;
          // Run the 1st query
          db.pool.query(queryUpdateInfo, [first_name, last_name, email, address, patron_id], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }            
              else
              {
                res.send(rows);
              }
})});

//fix
app.post('/add-artwork-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    
    // query_test = `SET FOREIGN_KEY_CHECKS = 0`;
    // db.pool.query(query_test, function(error, rows, fields){
    
    //     // Check to see if there was an error
    //     if (error) {

    //         // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
    //         console.log(error)
    //         res.sendStatus(400);
    //     }

    //     // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
    //     // presents it on the screen
    //     else
    //     {
    //         res.redirect('/artwork');
    //     }
    // })
    query1 = `INSERT INTO Artworks (title, price, dimensions, medium, description) VALUES ('${data['title']}', '${data['price']}', '${data['dimensions']}', '${data['medium']}', '${data['description']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/artwork');
        }
    })
})


app.post('/add-frame-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    query1 = `INSERT INTO Frames (frame_id, price, inventory) VALUES ('${data['input-size']}', '${data['input-price']}', '${data['input-inventory']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/frames');
        }
    })
})

app.delete('/delete-frame-ajax/', function(req,res,next){
    let data = req.body;
    let frame_id = parseInt(data.frame_id);
    let deleteBsg_Cert_People = `DELETE FROM Frames WHERE frame_id = ?`;
    // let deleteBsg_People= `DELETE FROM bsg_people WHERE id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteBsg_Cert_People, [frame_id], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                res.sendStatus(204);
              }
  })});


app.put('/put-frame-ajax', function(req,res,next){
    let data = req.body;
  
    let frame_id = data.frame_id
    let price = data.price
    let inventory = data.inventory
  
    let queryUpdateInfo = `UPDATE Frames SET price = ?, inventory = ? WHERE Frames.frame_id = ?`;
          // Run the 1st query
          db.pool.query(queryUpdateInfo, [price, inventory, frame_id], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }            
              else
              {
                res.send(rows);
              }
})});



app.post('/add-artist-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    query1 = `INSERT INTO Patrons (first_name, last_name, email, address, is_artist) VALUES ('${data['input-fname']}', '${data['input-lname']}', '${data['email']}', '${data['address']}', 1)` ;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/artists');
        }
    })
})



app.post('/add-transaction-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    query1 = `INSERT INTO Transaction (first_name, last_name, email, address) VALUES ('${data['input-patron']}', '${data['input-date']}', '${data['input-artworks']}', '${data['input-frames']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/patrons');
        }
    })
})



app.listen(PORT, function () {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});