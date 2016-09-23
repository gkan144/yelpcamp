//INCLUDES
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

var app = express();

//Initial config
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.Promise = global.Promise;

seedDB();

app.use(require("express-session")({secret: "c9d320e9-d84a-4f94-bc34-f85c7151bd3e", resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.get("/",function(req,res){
    res.render("landing"); 
});

app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(error, campgrounds){
        if(error) {
            console.error(error);
            res.status(500).render("error.ejs",{message: "INTERNAL SERVER ERROR"});
        } else {
            res.render("campgrounds/index",{campgrounds: campgrounds});    
        }
    });
});

app.post("/campgrounds", function (req, res) {
    Campground.create({name: req.body.name, image: req.body.image, description: req.body.description}, function(error, campground){
        if(error) console.error(error);
        else console.log(JSON.stringify(campground, null, 2));
        res.redirect("/campgrounds");
    });
});

app.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new.ejs");
});

app.get("/campgrounds/:id", function (req, res) {
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

app.get("/campgrounds/:id/comments/new",isLoggedIn, function(req, res){
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

app.post("/campgrounds/:id/comments",isLoggedIn, function(req, res){
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
                    foundCampground.comments.push(createdComment);
                    foundCampground.save();
                    res.redirect("/campgrounds/"+foundCampground._id);
                }
            });
        }
    });
});

app.get("/register", function (req, res) {
   res.render("register");
});

app.post("/register", function (req, res) {
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

app.get("/login", function(req, res){
    res.render("login.ejs");
});

app.post("/login", passport.authenticate("local", {successRedirect:"/campgrounds", failureRedirect:"/login"}));

app.get("/logout", function(req, res){
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

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Application listening on "+process.env.IP+":"+process.env.PORT); 
});