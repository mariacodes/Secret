//will activate .env
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');

//make schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

//adding encryption
// const secret = "Thisisourlittlesecret."
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:['password']});

const User = mongoose.model("User", userSchema);

//App get to render each page
app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err, result) {
    if (!err) {
      //only go to secrets page if they are register or logged in
      res.render("secrets");
    } else {
      console.log(err);
    }
  })
})

app.post("/login", function(req,res){
  const curUsername = req.body.username;
  const curPassword = req.body.password;

  User.findOne({email: curUsername},function(err,result){
    if(result.password === curPassword){
      res.render("secrets");
    }
    else{
      console.log(err);
    }
  })
})





app.listen(3000, function() {
  console.log("Server is connected to local host.");
});
