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

app.use(bodyParser.json());
app.post("/users", function(req, res) {
  const newName = req.body.name;
  const newEmail = req.body.email;

  const query = "INSERT INTO users(name, email) VALUES ($1, $2)";
  pool
    .query(query, [newName, newEmail])
    .then(() => res.send(" created!"))
    .catch(e => console.error(e));
});

app.listen(5000, function() {
  console.log("Server is listening on port 5000. Ready to accept requests!");
});
