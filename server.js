const express = require("express");
const app = express();
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const secret = require("./secret");
const cors = require("cors");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "test_project",
  password: secret.dbPassword,
  port: 5432
});
app.use(cors());

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

function addUser(pool, req) {
  const newName = req.body.name;
  const newEmail = req.body.email;

  const query = "INSERT INTO users(name, email) VALUES ($1, $2)";
  return pool.query(query, [newName, newEmail]);
  // .then(() => res.send(" created!"))
  // .catch(e => console.error(e));
}

app.use(bodyParser.json());

// function doesEmailExist(pool, email) {
//   const query = "SELECT * FROM users WHERE email = $1";
//   return pool.query(query, [email]).then(res => {
//     return res.rows.length > 0;
//   });
// }

app.post("/users", function(req, res) {
  addUser(pool, req)
    .then(() => {
      res.status(201).send("created");
    })
    .catch(() => {
      // check err -- if err tells me that the UNIQUE constraint was violated
      // then res.status(409).send('email already exists')

      res.status(500).send("There was some");
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
app.put("/users/:usersId", (req, res) => {
  const usersId = req.params.usersId;
  const name = req.body.name;
  const email = req.body.email;
  const query = "UPDATE users SET name=$1, email=$2 where id = $3";
  const parameters = [name, email, usersId];

  pool
    .query(query, parameters)
    .then(() => res.status(200).send("Users updated!"))
    .catch(err => res.json(err, 500));
});
app.delete("/users/:usersId", (req, res) => {
  const usersId = req.params.usersId;

  pool
    .query("select * from users where id = $1", [usersId])
    .then(result => {
      if (result.rows.length > 0) {
        res.status(400).send("users has orders, so can't be deleted");
        return;
      }

      pool
        .query("delete from users where id = $1", [usersId])
        .then(() => res.status(201).send("Users deleted"))
        .catch(err => res.json(err, 500));
    })
    .catch(err => res.json(err, 500));
});

app.listen(5000, function() {
  console.log("Server is listening on port 5000. Ready to accept requests!");
});
