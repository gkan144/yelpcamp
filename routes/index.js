var passport = require("passport");
var express = require("express");
var User = require("../models/user");

var router = express.Router();

router.get("/",function(req,res){
    res.render("landing"); 
});

router.get("/register", function (req, res) {
   res.render("register");
});

router.post("/register", function (req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err) {
            req.flash("error", err.message);
            console.error(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.flash("success", "Welcome to YelpCamp" + user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});

router.get("/login", function(req, res){
    res.render("login.ejs");
});

router.post("/login", passport.authenticate("local", {successRedirect:"/campgrounds", failureRedirect:"/login"}));

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have been logged out");
    res.redirect("/");
});

module.exports = router;