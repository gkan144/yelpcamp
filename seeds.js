var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {name: "Salmon Creek", image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg", description: "Bacon ipsum dolor amet short ribs pig magna aute spare ribs. Capicola eu dolore voluptate, est venison tempor pork pork belly hamburger andouille filet mignon consequat proident in. Et eu voluptate cillum, pariatur aliquip tenderloin picanha t-bone rump in alcatra. Tempor sunt spare ribs, pancetta voluptate ut corned beef ea. Chuck fugiat occaecat flank. Short loin incididunt fatback, turkey quis rump adipisicing spare ribs proident voluptate anim meatball ullamco kevin consequat."},
    {name: "Granite Hill", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg", description: "Bacon ipsum dolor amet short ribs pig magna aute spare ribs. Capicola eu dolore voluptate, est venison tempor pork pork belly hamburger andouille filet mignon consequat proident in. Et eu voluptate cillum, pariatur aliquip tenderloin picanha t-bone rump in alcatra. Tempor sunt spare ribs, pancetta voluptate ut corned beef ea. Chuck fugiat occaecat flank. Short loin incididunt fatback, turkey quis rump adipisicing spare ribs proident voluptate anim meatball ullamco kevin consequat."},
    {name: "Mountain Goat's Rest", image: "https://farm5.staticflickr.com/4027/4368764673_c8345bd602.jpg", description: "Bacon ipsum dolor amet short ribs pig magna aute spare ribs. Capicola eu dolore voluptate, est venison tempor pork pork belly hamburger andouille filet mignon consequat proident in. Et eu voluptate cillum, pariatur aliquip tenderloin picanha t-bone rump in alcatra. Tempor sunt spare ribs, pancetta voluptate ut corned beef ea. Chuck fugiat occaecat flank. Short loin incididunt fatback, turkey quis rump adipisicing spare ribs proident voluptate anim meatball ullamco kevin consequat."}
];

module.exports = function () {
    Campground.remove({}, function(err) {
        if(err) console.error(err);
        else {
            console.log('Removed campgrounds');
            data.forEach(function(campground) {
                Campground.create(campground, function(err, campground) {
                    if(err) console.error(err);
                    else {
                        console.log("Added campground");
                        Comment.create({text: "I am a random comment from a troll", author: "Troll"}, function(error, comment){
                            if(error) console.error(error);
                            else {
                                campground.comments.push(comment);
                                campground.save();   
                            }
                        });
                    }
                }); 
            });
        }
    });

}