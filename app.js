const express = require("express");
var request = require("request");
const sendMail = require("./mail.js");
require("dotenv").config();

const app = express();

// Access pubic folder
app.use(express.static('public'));

// Parse HTML forms
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

// Template engine
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/submitForm", (req, res) => {
  if(
    req.body.captcha === undefined ||
    req.body.captcha === "" ||
    req.body.captcha === null
  ){
    return res.json({success:false, msg:"Please select captcha"});
  }

  // Secret Key
  const secretKey = process.env.SECRET_KEY;

  // Verify URL
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.socket.remoteAddress}`;

  //Make request to verify URL
  request(verifyUrl, (err, response, body) => {
    body = JSON.parse(body);

    // If not succesfull
    if(body.success !== undefined && !body.success){
      res.json({success:false, msg:"Failed captcha verification"});
    }

    const { email, name, message } = req.body;

    sendMail(email, name, message, function(err, data) {
      if (err) res.json({success:false, msg:"Internal error"});
      else res.json({success:true, msg:"Success"});
    }); 
  })  
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port${PORT}`);
});