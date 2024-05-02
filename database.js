const mysql = require("mysql2");
// create a new MySQL connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Mysql123",
    database: "socialmediaapp",
});
// connect to the MySQL database
function connectDB(db) {
    db.connect((error) => {
        if (error) {
            console.error("Error connecting to MySQL database:", error);
        } else {
            console.log("Connected to MySQL database!");
        }
    });
    return db;
}
// close the MySQL connection
function closeDB(db) {
    db.end();
    return db;
}

module.exports = {
    connection,
    connectDB,
    closeDB,
};

// const { connection, connectDB, closeDB } = require("./database");