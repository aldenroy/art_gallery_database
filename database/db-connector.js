// Get an instance of mysql we can use in the app
// Citation for the following code:
// Date: 2023/03/02
// Copied and adapted from OSU GitHub (osu-cs340-ecampus)
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : '',
    password        : '',
    database        : ''
})

// Export it for use in our application
module.exports.pool = pool;
// Pool is group of connections, these will all be exported in SQl to login to stuff