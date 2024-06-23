const express = require('express');
const sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser')
const app = express();
const port = 3000;
const dbFile = './employee.db';
const cors =  require('cors')


app.use(cors())
app.use(bodyParser.json())


const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    return console.error("Error opening database:", err.message);
  }
  console.log("Connected to the SQLite database.");
});

app.get('/employees', (req, res) => {
  db.all(`SELECT * FROM emp`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post("/createUser", (req, res) => {
    const { username, password } = req.body;
  
    db.serialize(() => {
      const stmt = db.prepare(`INSERT INTO USERS (username, password) VALUES (?, ?)`);
      stmt.run(username, password, (err) => {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ error: err.message });
        }
        console.log("User added successfully");
        res.status(200).json({ message: "User added successfully" });
      });
      stmt.finalize();
    });
  });

app.post("/login",(req,res)=>{
    const {username,password} = req.body
    
    
  db.all(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (rows.length > 0) {
      console.log("Login successful");
      res.status(200).json({ message: "Login successful", user: rows[0] });
    } else {
      console.log("Invalid username or password");
      res.status(401).json({ message: "Invalid username or password" });
    }
  });
})
app.post("/createEmp", (req, res) => {
    const { name, salary , department} = req.body;
  
    db.serialize(() => {
      const stmt = db.prepare(`INSERT INTO emp (name , salary , department) VALUES (?, ? , ?)`);
      stmt.run(name, salary,department, (err) => {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ error: err.message });
        }
        console.log("emp added successfully");
        res.status(200).json({ message: "emp added successfully" });
      });
      stmt.finalize();
    });
  });

app.post("/updateEmp" , (req,res)=>{
    const {id, name, salary , department} = req.body;
    db.serialize(() => {
        // Check if user with id exists
        db.get("SELECT * FROM emp WHERE id = ?", id, (err, row) => {
          if (err) {
            console.error(err.message);
            return res.status(500).json({ error: err.message });
          }
          
          if (!row) {
            // User with the specified id does not exist
            return res.status(404).json({ error: `User with id ${id} not found` });
          }
          
          // User exists, proceed with update
          const stmt = db.prepare(`UPDATE emp SET name = ?, salary = ?, department = ? WHERE id = ?`);
          stmt.run(name, salary, department, id);
          stmt.finalize((err) => {
            if (err) {
              console.error(err.message);
              return res.status(500).json({ error: err.message });
            }
            console.log("emp updated successfully");
            res.status(200).json({ message: "emp updated successfully" });
          });
        });
      });
    })

app.post("/deleteEmp",(req,res)=>{
    const {id} = req.body
    db.serialize(() => {
        // Check if user with id exists
        db.get("SELECT * FROM emp WHERE id = ?", id, (err, row) => {
          if (err) {
            console.error(err.message);
            return res.status(500).json({ error: err.message });
          }
          
          if (!row) {
            // User with the specified id does not exist
            return res.status(404).json({ error: `User with id ${id} not found` });
          }
          
          // User exists, proceed with update
          const stmt = db.prepare('DELETE FROM emp WHERE id = ?');
  stmt.run(id, function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log(`Employee with id ${id} deleted successfully`);
    res.status(200).json({ message: `Employee with id ${id} deleted successfully` });
  });

  stmt.finalize(); // Finalize the statement after execution
});
        });
      });



  



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing the database connection:", err.message);
    }
    console.log('Closed the database connection.');
    process.exit(0);
  });
});
