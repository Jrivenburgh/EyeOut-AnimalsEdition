const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
const users = require("./routes/api/users");
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://jurassicjosh:x8YTIi8TgH095sSs@eyeout-shard-00-00-ngqhj.mongodb.net:27017,eyeout-shard-00-01-ngqhj.mongodb.net:27017,eyeout-shard-00-02-ngqhj.mongodb.net:27017/User?ssl=true&replicaSet=EyeOut-shard-0&authSource=admin&retryWrites=true"
const app = express();
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
// DB Config

const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("User").collection("users");

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/users", users);

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there

// Serve Static assets if in Prodcution
if(process.env.NODE_ENV ==="production") {
  // Set Static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });

}

app.listen(port, () => console.log(`Server up and running on port ${port} !`));

client.close();
});