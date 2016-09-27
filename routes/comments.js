var express = require("express");

var Campground = require("../models/campground");
var Comment = require("../models/comment");

var isLoggedIn = require("../middleware").isLoggedIn;
var checkUserOwnsComment = require("../middleware").checkUserOwnsComment;

var router = express.Router({mergeParams: true});

router.get("/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(error, foundCampground) {
        if(error) {
            console.error(error);
            req.flash("error", "An internal error occured");
            res.redirect(500, "back");
        } else if(foundCampground===undefined || foundCampground===null){
            req.flash("error", "The page you are looking for has not been found");
            res.redirect(404, "back");
        } else {
            res.render("comments/new",{campground: foundCampground});
        }
    });
});

router.post("/", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(error, foundCampground) {
        if(error) {
            console.error(error);
            req.flash("error", "An internal error occured");
            res.redirect(500, "back");
        } else if(foundCampground===undefined || foundCampground===null) {
            req.flash("error", "The page you are looking for has not been found");
            res.redirect(404, "back");
        } else {
            Comment.create({author: req.body.author, text: req.body.text}, function(error, createdComment){
                if(error) {
                    console.error(error);
                    req.flash("error", "An internal error occured");
                    res.redirect(500, "back");
                } else if(foundCampground===undefined || foundCampground===null) {
                    req.flash("error", "The page you are looking for has not been found");
                    res.redirect(404, "back");
                } else {
                    createdComment.author.id = req.user._id;
                    createdComment.author.username = req.user.username;
                    createdComment.save();
                    foundCampground.comments.push(createdComment);
                    foundCampground.save();
                    req.flash("success", "Successfully added comment.");
                    res.redirect("/campgrounds/"+foundCampground._id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", isLoggedIn, checkUserOwnsComment, function(req, res){
        if(req.foundComment) {
            res.render("comments/edit.ejs",{campground_id: req.params.id, comment: req.foundComment});
        } else {
            console.error(new Error("Comment not found after middleware"));
            req.flash("error", "An internal error occured");
            res.redirect(500, "back");
        }
});

router.put("/:comment_id", isLoggedIn, checkUserOwnsComment, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, {text: req.body.text}, function(error, foundComment) {
        if(error) {
            console.error(error);
            req.flash("error", "An internal error occured");
            res.redirect(500, "back");
        } else if(foundComment===undefined || foundComment===null){
            req.flash("error", "The page you are looking for has not been found");
            res.redirect(404, "back");
        } else {
            req.flash("success", "Successfully updated comment.");
            res.redirect("/campgrounds/"+req.params.id);    
        }
    });
});

router.delete("/:comment_id", isLoggedIn, checkUserOwnsComment, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(error){
        if(error) {
            console.error(error);
            req.flash("error", "An internal error occured");
            res.redirect(500, "back");
        } else {
            req.flash("success", "Successfully deleted comment.");
            res.redirect("/campgrounds/"+req.params.id);
        }
   });
});

module.exports = router;