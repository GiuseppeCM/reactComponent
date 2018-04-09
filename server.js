var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';


router.use(express.static('public'));

router.use(function (req,res,next) {
  next();
});

router.get("/", function(req,res){
  res.sendFile(path + "default.html");
});


app.use("/", router);

app.use("*", function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(8080, function(){
  console.log("Live at Port 8080");
});
