const mysql = require("mysql2");
// create a new MySQL connection
const connection = mysql.createConnection({
    host: "193.234.27.236",
    user: "stuuser",
    password: "hr2#RT54!hREHhr56j6/674g#edf134!657hthgfGHTR#!ef3",
    database: "stu",
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

module.exports = {
    connection,
    connectDB,
};

// const { connection, connectDB } = require("./database");