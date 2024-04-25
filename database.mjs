import mysql from 'mysql2';

// Anslutning till MySQL-databasen
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mysql123', 
  database: 'socialmediaapp',
  port: 3306
});

// Test av anslutningen
connection.connect((err) => {
  if (err) {
    console.error('Fel vid anslutning till databasen:', err);
    return;
  }
  console.log('Ansluten till MySQL-databasen');
});

export default connection;
