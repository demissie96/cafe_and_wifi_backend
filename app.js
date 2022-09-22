const express = require("express");
const port = 8080;
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();

// for No 'Access-Control-Allow-Origin' error
app.use(cors());

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
      res.json(cafes);
    });
  })
  .delete("/", (req, res) => {
    // Delete chosen cafe

    var id = req.headers.id;
    console.log(id);
    let db = new sqlite3.Database("./cafes.db");
    let sql = `DELETE FROM cafe WHERE id=${id}`;

    db.run(sql, (err) => {
      if (err) {
        console.log(err);
        db.close();
        res.json(`${id} was not deleted.`);
      } else {
        db.close();
        console.log(`id: ${id} successfully deleted.`);
        res.json(`id: ${id} successfully deleted.`);
      }
    });
  })
  .post("/", (req, res) => {
    // Add new cafe to database

    let name = req.headers.name;
    let map_url = req.headers.map_url;
    let img_url = req.headers.img_url;
    let location = req.headers.location;
    let has_sockets = req.headers.has_sockets;
    let has_toilet = req.headers.has_toilet;
    let has_wifi = req.headers.has_wifi;
    let can_take_calls = req.headers.can_take_calls;
    let seats = req.headers.seats;
    let coffee_price = req.headers.coffee_price;
    let db = new sqlite3.Database("./cafes.db");
    let sql = `
    INSERT INTO cafe
     (name, map_url, img_url, location, has_sockets, has_toilet, has_wifi, can_take_calls, seats, coffee_price) 
    VALUES('${name}', '${map_url}', '${img_url}', '${location}', ${has_sockets}, ${has_toilet}, ${has_wifi}, ${can_take_calls}, '${seats}', '${coffee_price}')`;

    db.run(sql, (err) => {
      if (err) {
        console.log(err);
        db.close();
        res.json(`already added`);
      } else {
        db.close();
        console.log(`New cafe added: ${name}, ${map_url}`);
        res.redirect("/");
      }
    });
  })
  .put("/", (req, res) => {
    // Update an element

    let id = req.headers.id;
    let name = req.headers.name;
    let map_url = req.headers.map_url;
    let img_url = req.headers.img_url;
    let location = req.headers.location;
    let has_sockets = req.headers.has_sockets;
    let has_toilet = req.headers.has_toilet;
    let has_wifi = req.headers.has_wifi;
    let can_take_calls = req.headers.can_take_calls;
    let seats = req.headers.seats;
    let coffee_price = req.headers.coffee_price;
    let db = new sqlite3.Database("./cafes.db");
    let sql = `
    UPDATE cafe SET 
      name = '${name}', map_url = '${map_url}', img_url = '${img_url}', location = '${location}', has_sockets = ${has_sockets}, has_toilet = ${has_toilet}, has_wifi = ${has_wifi}, can_take_calls = ${can_take_calls}, seats = '${seats}', coffee_price = '${coffee_price}' 
    WHERE id = ${id}`;

    db.run(sql, (err) => {
      if (err) {
        console.log(err);
        db.close();
        res.json(`already added`);
      } else {
        db.close();
        console.log(`Cafe edited: ${name}`);
        res.json(`Cafe edited: ${name}`);
      }
    });
  });

app.get("/reset", (req, res) => {
  let cafes = [];
  // open the database and make a query
  let db1 = new sqlite3.Database("./cafes original.db");
  let sql = `SELECT * FROM cafe`;

  db1.each(sql, (err, row) => {
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
  db1.close(() => {
    let db2 = new sqlite3.Database("./cafes.db");
    let sql = `DELETE FROM cafe`;
    db2.run(sql);
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
      console.log(`cafe id: ${cafe.id}`);
      db2.run(
        `
      INSERT INTO cafe 
        (id, name, map_url, img_url, location, has_sockets, has_toilet, has_wifi, can_take_calls, seats, coffee_price) 
      VALUES(${id}, '${name}', '${map_url}', '${img_url}', '${location}', ${has_sockets}, ${has_toilet}, ${has_wifi}, ${can_take_calls}, '${seats}', '${coffee_price}')`,
        (err) => {
          if (err) {
            console.log(`PROBLEM WITH ${cafe.id}`);
          } else {
            console.log(`Good: ${id}`);
          }
        }
      );
    });
    console.log("finished tghe second db foreach loop");
    db2.close(() => {
      res.json("close the 2.db");
    });
  });
});

app.get("/get-selected", (req, res) => {
  var data;
  let id = req.headers.id;
  console.log(id);
  let db = new sqlite3.Database("./cafes.db");
  let sql = `SELECT * FROM cafe WHERE id = ${id}`;

  db.each(sql, (err, row) => {
    if (err) {
      data = err;
    } else {
      console.log(row);
      data = row;
    }
  });
  db.close(() => {
    res.json({
      id: data.id,
      name: data.name,
      map_url: data.map_url,
      img_url: data.img_url,
      location: data.location,
      has_sockets: data.has_sockets,
      has_toilet: data.has_toilet,
      has_wifi: data.has_wifi,
      can_take_calls: data.can_take_calls,
      seats: data.seats,
      coffee_price: data.coffee_price,
    });
  });
});

app.listen(port, () => {
  console.log(`Example app run on http://localhost:${port}/`);
});
