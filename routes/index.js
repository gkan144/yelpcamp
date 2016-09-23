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
            console.error(err);
            res.render("error.ejs", {message: "INTERNAL SERVER ERROR"});
        } else {
            passport.authenticate("local")(req, res, function(){
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
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}

module.exports = {router: router, isLoggedIn: isLoggedIn};