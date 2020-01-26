"use strict";

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
//const fccTesting = require("./freeCodeCamp/fcctesting.js");
const session = require("express-session");
const mongo = require("mongodb").MongoClient;

const auth = require("./auth.js");
const routes = require("./routes.js");

const app = express();


//fccTesting(app); //For FCC testing purposes
app.use("/public", express.static(process.cwd() + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "pug");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);

mongo.connect(process.env.MONGO_URI,{ useUnifiedTopology: true }, (err, client) => {
  const db = client.db("freecodecamp");
  if (err) {
    console.log("Database error: " + err);
  } else {
    console.log("Successful database connection");
    
    auth(app,db);
    routes(app,db);

    app.listen(process.env.PORT || 3000, () => {
      console.log("Listening on port " + process.env.PORT);
    });
  }
});
