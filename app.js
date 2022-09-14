const express = require("express");
const port = 3000;
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.get("/", (req, res) => {
  let cafes = [];
  // open the database and make a query
  let db = new sqlite3.Database("./cafes.db");
  let sql = `SELECT * FROM cafe`;

  db.each(sql, (err, row) => {
    if (err) {
      cafes.push(err);
    } else {
      cafes.push({ id: row.id, name: row.name, address: row.map_url });
    }
  });
  db.close(() => {
    res.json({ ...cafes });
  });
});

app.get("/some", (req, res) => {
  let cafes = [];
  // open the database and make a query
  let db = new sqlite3.Database("./cafes.db");
  let sql = `SELECT * FROM cafe WHERE id < 10 AND id > 7`;

  db.each(sql, (err, row) => {
    if (err) {
      cafes.push(err);
    } else {
      cafes.push({ id: row.id, name: row.name, address: row.map_url });
    }
  });
  db.close(() => {
    res.json({ ...cafes });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
