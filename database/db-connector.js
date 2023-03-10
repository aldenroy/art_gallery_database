// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_kealeyco',
    password        : '8318',
    database        : 'cs340_kealeyco'
})

// Export it for use in our application
module.exports.pool = pool;
// Pool is group of connections, these will all be exported in SQl to login to stuff