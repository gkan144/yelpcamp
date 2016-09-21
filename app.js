//INCLUDES
var express = require("express");
var bodyParser = require("body-parser");
var app     = express();

//Initial config
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

var campgrounds = [
    {
        name: "Salmon Creek",
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg"
    },
    {
        name: "Granite Hill",
        image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"
    },
    {
        name: "Mountain Goat's Rest",
        image: "https://farm5.staticflickr.com/4027/4368764673_c8345bd602.jpg"
    }
];

app.get("/",function(req,res){
   res.render("landing"); 
});

app.get("/campgrounds", function(req, res) {
    res.render("campgrounds",{campgrounds: campgrounds});
});

app.post("/campgrounds", function (req, res) {

});

app.get("/campgrounds/new", function (req, res) {
    res.render("new.ejs");
});

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Application listening on "+process.env.IP+":"+process.env.PORT); 
});