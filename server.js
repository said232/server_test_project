const express = require("express");
const app = express();
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const secret = require("./secret");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "test_project",
  password: secret.dbPassword,
  port: 5432
});

app.get("/", function(req, res) {
  res.send("hello world");
});
app.get("/users", (req, res) => {
  pool
    .query("SELECT * FROM users")
    .then(result => res.json(result.rows))
    .catch(err => res.json(err, 404));
});

app.post("/", function(req, res) {
  res.send("Post request to the homepage");
});
/*

app.use(bodyParser.json());
app.post("/users", function(req, res) {
  const newName = req.body.name;
  const newEmail = req.body.email;

  const query = "INSERT INTO users(name, email) VALUES ($1, $2)";
  pool
    .query(query, [newName, newEmail])
    .then(() => res.send(" created!"))
    .catch(e => console.error(e));
});*/

function addUser(pool,req) {
  const newName = req.body.name;
  const newEmail = req.body.email;

  const query = "INSERT INTO users(name, email) VALUES ($1, $2)";
  return pool
    .query(query, [newName, newEmail])
    // .then(() => res.send(" created!"))
    // .catch(e => console.error(e));
}

app.use(bodyParser.json());

function doesEmailExist(pool, email) {
  const query = "SELECT * FROM users WHERE email = $1";
  return pool.query(query, [email]).then(res => {
    return res.rows.length > 0;
  });
}

app.post("/users", function(req, res) {
  const newName = req.body.name;
  const newEmail = req.body.email;

  doesEmailExist(pool, newEmail).then(response => {
    // console.log(response)
    // reponse is a boolean
    // response is true when email exists in the DB and response is false when email does not exist in the DB

    // foo should be a boolean
    // foo should be true when the email exists in the DB and foo should be false when the email does not exist in the DB

    if (response) {
      return res.send("exists");
    } else {
      // new function that:
      // creates a new user in the DB
      const foo = addUser(pool,req).then(response=> {
        
        res.status(201).send('created')
      })
      
    }
  });
  
  // then res.send('exists') or res.send('does not exist')

  // const query = "INSERT INTO users(name, email) VALUES ($1, $2)";
  // pool.query(query, [newName, newEmail])
  // .then(doesEmailExist retu

  // res.send(" created!");
  // } else {
  //   return res.status(409).send(` ${req.body.email} already exists!`);
  // )}
});

app.listen(5000, function() {
  console.log("Server is listening on port 5000. Ready to accept requests!");
});
