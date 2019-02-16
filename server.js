const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
const users = require("./routes/api/users");

const app = express();
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
// DB Config
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.mongoURI;
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("User").collection("users");
 // perform actions on the collection object
  client.close();
});
  

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