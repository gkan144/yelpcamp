var Campground = require("../models/campground");
var Comment = require("../models/comment");

function checkUserOwnsCampground(req, res, next) {
    Campground.findById(req.params.id, function(error, foundCampground){
        if(error) {
            req.flash("error", "An internal error occured");
            console.error(error);
            res.redirect(500, "back");
        } else if(foundCampground===undefined || foundCampground===null){
            req.flash("error", "The page you are looking for has not been found");
            res.redirect(404, "back");
        } else if(!foundCampground.author.id.equals(req.user._id)) {
            req.flash("error", "You are forbidden from accessing this resource");
            res.redirect(403, "back");
        } else {
            req["foundCampground"] = foundCampground;
            next();
        }
    });
}

function checkUserOwnsComment(req, res, next) {
    Comment.findById(req.params.comment_id, function(error, foundComment){
        if(error) {
            req.flash("error", "An internal error occured");
            console.error(error);
            res.redirect(500, "back");
        } else if(foundComment===undefined || foundComment===null){
            req.flash("error", "The page you are looking for has not been found");
            res.redirect(404, "back");
        } else if(!foundComment.author.id.equals(req.user._id)) {
            req.flash("error", "You are forbidden from accessing this resource");
            res.redirect(403, "back");
        } else {
            req["foundComment"] = foundComment;
            next();
        }
    });
}

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        req.flash("error", "Please login first.");
        res.redirect("/login");
    }
}

module.exports = {checkUserOwnsCampground: checkUserOwnsCampground, checkUserOwnsComment:checkUserOwnsComment, isLoggedIn:isLoggedIn};