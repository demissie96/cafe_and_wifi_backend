const express = require("express");
const port = 3000;
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app
  .get("/", (req, res) => {
    // List all cafe

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
  })
  .delete("/", (req, res) => {
    // Delete chosen cafe
    
    var id = req.body.id;
    let db = new sqlite3.Database("./cafes.db");
    let sql = `DELETE FROM cafe WHERE id=${id}`;
    db.run(sql);
    db.close();
    console.log(`Delete id: ${id}`);
    res.redirect("/");
  });


app.listen(port, () => {
  console.log(`Example app run on http://localhost:${port}/`);
});
