var express = require("express");

var Campground = require("../models/campground");
var Comment = require("../models/comment");

var isLoggedIn = require("./index.js").isLoggedIn;

var router = express.Router({mergeParams: true});

router.get("/new",isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(error, foundCampground) {
        if(error) {
            console.error(error);
            res.status(500).render("error.ejs",{message: "INTERNAL SERVER ERROR"});
        } else if(foundCampground===undefined || foundCampground===null){
            res.status(404).render("error.ejs",{message: "NOT FOUND"});
        } else {
            res.render("comments/new",{campground: foundCampground});
        }
    });
});

router.post("/",isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(error, foundCampground) {
        if(error) {
            console.error(error);
            res.status(500).render("error.ejs",{message: "INTERNAL SERVER ERROR"});
        } else if(foundCampground===undefined || foundCampground===null) {
            res.status(404).render("error.ejs",{message: "NOT FOUND"});
        } else {
            Comment.create({author: req.body.author, text: req.body.text}, function(error, createdComment){
                if(error) {
                    console.error(error);
                    res.status(500).render("error.ejs",{message: "INTERNAL SERVER ERROR"});
                } else if(foundCampground===undefined || foundCampground===null) {
                    res.status(404).render("error.ejs",{message: "NOT FOUND"});
                } else {
                    createdComment.author.id = req.user._id;
                    createdComment.author.username = req.user.username;
                    createdComment.save();
                    foundCampground.comments.push(createdComment);
                    foundCampground.save();
                    res.redirect("/campgrounds/"+foundCampground._id);
                }
            });
        }
    });
});

module.exports = router;