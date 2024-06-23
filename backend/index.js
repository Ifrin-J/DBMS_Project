const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./employee.db');

db.all(`SELECT * FROM users`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    console.log(rows)
  });

// db.serialize(() => {
//   db.run(`CREATE TABLE IF NOT EXISTS USERS (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     USERNAME TEXT NOT NULL,
//     PASSWORD TEXT NOT NULL
//   )`, (err) => {
//     if (err) {
//       return console.error(err.message);
//     }
//     console.log("Table 'user' created successfully");
//   });
// });



// db.close((err) => {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log('Closed the database connection.');
// });


