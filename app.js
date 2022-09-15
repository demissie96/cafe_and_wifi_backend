const express = require("express");
const port = 8080;
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();

// for No 'Access-Control-Allow-Origin' error
app.use(cors())

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
        cafes.push({
          id: row.id,
          name: row.name,
          map_url: row.map_url,
          img_url: row.img_url,
          location: row.location,
          has_sockets: row.has_sockets,
          has_toilet: row.has_toilet,
          has_wifi: row.has_wifi,
          can_take_calls: row.can_take_calls,
          seats: row.seats,
          coffee_price: row.coffee_price,
        });
      }
    });
    db.close(() => {
      res.json( cafes );
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
  })
  .post("/", (req, res) => {
    // Add new cafe to database

    let name = req.body.name;
    let map_url = req.body.map_url;
    let img_url = req.body.img_url;
    let location = req.body.location;
    let has_sockets = req.body.has_sockets;
    let has_toilet = req.body.has_toilet;
    let has_wifi = req.body.has_wifi;
    let can_take_calls = req.body.can_take_calls;
    let seats = req.body.seats;
    let coffee_price = req.body.coffee_price;
    let db = new sqlite3.Database("./cafes.db");
    let sql = `
    INSERT INTO cafe
     (name, map_url, img_url, location, has_sockets, has_toilet, has_wifi, can_take_calls, seats, coffee_price) 
    VALUES('${name}', '${map_url}', '${img_url}', '${location}', ${has_sockets}, ${has_toilet}, ${has_wifi}, ${can_take_calls}, '${seats}', '${coffee_price}')`;

    db.run(sql, (err) => {
      if (err) {
        console.log(err);
        db.close();
        res.json(
          `${name} was not added. Maybe it's already in the database list.`
        );
      } else {
        db.close();
        console.log(`New cafe added: ${name}, ${map_url}`);
        res.redirect("/");
      }
    });
  })
  .put("/", (req, res) => {
    // Modify/Update an element

    let id = req.body.id;
    let name = req.body.name;
    let map_url = req.body.map_url;
    let db = new sqlite3.Database("./cafes.db");
    let sql = `UPDATE cafe SET name = '${name}', map_url = '${map_url}' WHERE id = ${id}`;

    db.run(sql);
    db.close();
    console.log(
      `Cafe with id ${id} has been updated with name: ${name}, map_url: ${map_url}`
    );
    res.redirect("/");
  });

app.get("/reset", (req, res) => {
  let cafes = [];
  // open the database and make a query
  let db = new sqlite3.Database("./cafes original.db");
  let sql = `SELECT * FROM cafe`;

  db.each(sql, (err, row) => {
    if (err) {
      cafes.push(err);
    } else {
      cafes.push({
        id: row.id,
        name: row.name,
        map_url: row.map_url,
        img_url: row.img_url,
        location: row.location,
        has_sockets: row.has_sockets,
        has_toilet: row.has_toilet,
        has_wifi: row.has_wifi,
        can_take_calls: row.can_take_calls,
        seats: row.seats,
        coffee_price: row.coffee_price,
      });
    }
  });
  db.close(() => {
    let db = new sqlite3.Database("./cafes.db");
    let sql = `DELETE FROM cafe`;
    db.run(sql);
    cafes.forEach((cafe) => {
      let id = cafe.id;
      let name = cafe.name;
      let map_url = cafe.map_url;
      let img_url = cafe.img_url;
      let location = cafe.location;
      let has_sockets = cafe.has_sockets;
      let has_toilet = cafe.has_toilet;
      let has_wifi = cafe.has_wifi;
      let can_take_calls = cafe.can_take_calls;
      let seats = cafe.seats;
      let coffee_price = cafe.coffee_price;
      db.run(`
      INSERT INTO cafe 
        (id, name, map_url, img_url, location, has_sockets, has_toilet, has_wifi, can_take_calls, seats, coffee_price) 
      VALUES(${id}, '${name}', '${map_url}', '${img_url}', '${location}', ${has_sockets}, ${has_toilet}, ${has_wifi}, ${can_take_calls}, '${seats}', '${coffee_price}')`);
    });
    db.close(() => {
      res.redirect("/");
    });
  });
});

app.listen(port, () => {
  console.log(`Example app run on http://localhost:${port}/`);
});
