/* 
    SETUP
*/
// Express
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 15646;                 // Set a port number at the top so it's easy to change in the future
// Database
var db = require('./db-connector')

/* 
    ROUTES
*/
app.get('/', function(req, res)
    {
        // Define our queries
        query1 = 'DROP TABLE IF EXISTS diagnostic;';
        query2 = 'CREATE TABLE diagnostic(id INT PRIMARY KEY AUTO_INCREMENT, text VARCHAR(255) NOT NULL);';
        query3 = 'INSERT INTO diagnostic (text) VALUES ("MySQL is working!")';
        query4 = 'SELECT * FROM diagnostic;';

        // Execute every query in an asynchronous manner, we want each query to finish before the next one starts

        // DROP TABLE...
        db.pool.query(query1, function (err, results, fields){

            // CREATE TABLE...
            db.pool.query(query2, function(err, results, fields){

                // INSERT INTO...
                db.pool.query(query3, function(err, results, fields){

                    // SELECT *...
                    db.pool.query(query4, function(err, results, fields){

                        // Send the results to the browser
                        let base = "<h1>MySQL Results:</h1>"
                        res.send(base + JSON.stringify(results));
                    });
                });
            });
        });
    });

//The same applies to each of the nested db.pool.query() calls. Query is a method of a pool instance. 
//So in this case, a query will be run using a connection from the pool we created with the credentials we provided in db-connector.js.

//In order to send a response back to the browser that is visiting our application we need to use the send(), sendStatus(), 
//render() or redirect() calls of the res instance. These are standard functions of a res (response) object defined by ExpressJS. 
//The send() call we use sends plain text back to the client, so if there is any formatting (HTML) that needs to be sent, 
//it will be on us to specify as such. The render() call
//leverages templates which are not necessary for such a trivial response, but will definitely have utility in later assignments. 

/* 
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});