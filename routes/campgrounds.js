var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");

var isLoggedIn = require("./index.js").isLoggedIn;


router.get("/", function(req, res) {
    Campground.find({}, function(error, campgrounds){
        if(error) {
            console.error(error);
            res.status(500).render("error.ejs",{message: "INTERNAL SERVER ERROR"});
        } else {
            res.render("campgrounds/index",{campgrounds: campgrounds});    
        }
    });
});

router.post("/", isLoggedIn, function (req, res) {
    Campground.create({name: req.body.name, image: req.body.image, description: req.body.description, author:{id: req.user.id, username: req.user.username}}, function(error, campground){
        if(error) console.error(error);
        else console.log(JSON.stringify(campground, null, 2));
        res.redirect("/campgrounds");
    });
});

router.get("/new", isLoggedIn, function (req, res) {
    res.render("campgrounds/new.ejs");
});

router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground) {
        if(error) {
            console.error(error);
            res.status(500).render("error.ejs",{message: "INTERNAL SERVER ERROR"});
        } else if(foundCampground===undefined || foundCampground===null){
            res.status(404).render("error.ejs",{message: "NOT FOUND"});
        } else {
            res.render("campgrounds/show.ejs", {campground: foundCampground});    
        }
    });
});

module.exports = router;