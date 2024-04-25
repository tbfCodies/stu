const mysql = require('mysql2');
// create a new MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mysql123',
  database: 'socialmediaapp'
});
// connect to the MySQL database
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL database:', error);
  } else {
    console.log('Connected to MySQL database!');
  }
  // Utför en SELECT-fråga för att hämta innehållet i "Users"-tabellen
  connection.query('SELECT * FROM Users', (err, results, fields) => {
    if (err) {
      console.error('Fel vid hämtning av data från "Users"-tabellen:', err);
    } else {
      // Visa resultatet i konsolen
      console.log('Innehåll i "Users"-tabellen:');
      console.log(results);
    }

});
// close the MySQL connection
connection.end();
});
