var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");

var isLoggedIn = require("../middleware").isLoggedIn;
var checkUserOwnsCampground = require("../middleware").checkUserOwnsCampground;


router.get("/", function(req, res) {
    Campground.find({}, function(error, campgrounds){
        if(error) {
            console.error(error);
            req.flash("error", "An internal error occured");
            res.redirect(500, "back");
        } else {
            res.render("campgrounds/index",{campgrounds: campgrounds});    
        }
    });
});

router.get("/new", isLoggedIn, function (req, res) {
    res.render("campgrounds/new.ejs");
});

router.post("/", isLoggedIn, function (req, res) {
    Campground.create({name: req.body.name, image: req.body.image, description: req.body.description, author:{id: req.user.id, username: req.user.username}}, function(error, campground){
        if(error) {
            console.error(error);
            req.flash("error", "An internal error occured");
            res.redirect(500, "back");
        } else {
            req.flash("success", "Successfully added campground.");
            res.redirect("/campgrounds");
        }
    });
});

router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground) {
        if(error) {
            console.error(error);
            req.flash("error", "An internal error occured");
            res.redirect(500, "back");
        } else if(foundCampground===undefined || foundCampground===null){
            req.flash("error", "The page you are looking for has not been found");
            res.redirect(404, "back");
        } else {
            res.render("campgrounds/show.ejs", {campground: foundCampground});
        }
    });
});

router.get("/:id/edit", isLoggedIn, checkUserOwnsCampground, function(req, res) {
    if(req.foundCampground) {
        res.render("campgrounds/edit.ejs", {campground: req.foundCampground});
    } else {
        console.error(new Error("Campground not found after middleware."));
        req.flash("error", "An internal error occured");
        res.redirect(500, "back");
    }
});

router.put("/:id", isLoggedIn, checkUserOwnsCampground, function(req,res){
        Campground.findByIdAndUpdate(req.params.id, {name: req.body.name, image: req.body.image, description: req.body.description}, function(error, foundCampground) {
        if(error) {
            console.error(error);
            req.flash("error", "An internal error occured");
            res.redirect(500, "back");
        } else if(foundCampground===undefined || foundCampground===null){
            req.flash("error", "The page you are looking for has not been found");
            res.redirect(404, "back");
        } else {
            req.flash("success", "Successfully updated campground");
            res.redirect("/campgrounds/"+req.params.id);    
        }
    });
});

router.delete("/:id", isLoggedIn, checkUserOwnsCampground, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(error){
        if(error) {
            console.error(error);
            req.flash("error", "An internal error occured");
            res.redirect(500, "back");
        } else {
            req.flash("success", "Successfully deleted campground");
            res.redirect("/campgrounds");
        }
   });
});

module.exports = router;