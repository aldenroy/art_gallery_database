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
    let queryArtworks = 'SELECT Artworks.*, Patrons.first_name, Patrons.last_name FROM Artworks JOIN Patrons ON Artworks.artist_id = Patrons.patron_id WHERE Patrons.is_artist = 1;'
    let queryArtists = 'SELECT * FROM Patrons WHERE is_artist = 1'

     //Exicutes query
     db.pool.query(queryArtworks, function (error, artworkResults, fields){

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else{
            db.pool.query(queryArtists, function (error, artistResults, fields){
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error)
                    res.sendStatus(400);
                }
                else{
                    //Renders artwork page with requested data
                    res.render('artwork', {title: 'Artwork', artwork: artworkResults, artists: artistResults});
                }
            });
        }
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

app.delete('/delete-patron-ajax/', function(req,res,next){
    let data = req.body;
    let personID = parseInt(data.id);
    let deletePatron = `DELETE FROM Patrons WHERE patron_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deletePatron, [personID], function(error, rows, fields){
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

// inserts data patron update form into database
  app.put('/update-patron-ajax', function(req,res,next){
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

// retrive the info of a single patron from the db to populate the update form
app.put('/retrive-patron-info-ajax', function(req,res,next){
    let data = req.body

    let queryPatronInfo = `SELECT * From Patrons WHERE patron_id = ?`

    db.pool.query(queryPatronInfo, [data.patron_id], function(error, data, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else{
            res.send(data);
        }
    })
});


app.post('/add-artwork-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    console.log(data);
        //no artist_id being inserted
        //will need a read query for a first and last name based on artist_id
    let query1 = `INSERT INTO Artworks (title, artist_id, price, dimensions, medium, description) VALUES ('${data['title']}', '${data['artist']}', '${data['price']}', '${data['dimensions']}', '${data['medium']}', '${data['description']}')`;
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

app.delete('/delete-artwork-ajax/', function(req,res,next){
    let data = req.body;
    let personID = parseInt(data.artwork_id);
    let deleteArtwork = `DELETE FROM Artworks WHERE artwork_id = ?`;
  
          // Run the 1st query
          db.pool.query(deleteArtwork, [personID], function(error, rows, fields){
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


app.put('/update-frame-ajax', function(req,res,next){
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

// retrive the info of a single frame from the db to populate the update form
app.put('/retrive-frame-info-ajax', function(req,res,next){
    let data = req.body

    let queryFrameInfo = `SELECT * FROM Frames WHERE frame_id = ?`

    db.pool.query(queryFrameInfo, [data.frame_id], function(error, data, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else{
            res.send(data);
        }
    })
});



app.post('/add-artist-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    query1 = `INSERT INTO Patrons (first_name, last_name, email, address, is_artist) VALUES ('${data['input-fname']}', '${data['input-lname']}', '${data['input-email']}', '${data['input-address']}', 1)` ;
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

app.put('/put-artist-ajax', function(req,res,next){
    let data = req.body;
  
    let first_name = data.first_name
    let last_name = data.last_name
    let email = data.email
    let address = data.address
    let patron_id = data.patron_id
  
    let queryUpdateInfo = `UPDATE Patrons SET first_name = ?, last_name = ?, email = ?, address = ?, is_artist = 1 WHERE Patrons.patron_id = ?`;
          // Run the 1st query
          db.pool.query(queryUpdateInfo, [first_name, last_name, email, address, 1, patron_id], function(error, rows, fields){
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

// retrive the info of a single patron from the db to populate the update form
app.put('/retrive-artist-info-ajax', function(req,res,next){
    let data = req.body

    let queryArtistInfo = `SELECT * From Patrons WHERE is_artist = 1 AND patron_id = ?`

    db.pool.query(queryArtistInfo, [data.patron_id], function(error, data, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else{
            res.send(data);
        }
    })
});

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