import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import './main.html';

Images = new Mongo.Collection("images");

//Scroll event
Session.set("imageLimit", 8);

lastScrollTop = 0; 
$(window).scroll(function(event){
  // test if we are near the bottom of the window
  if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
    // where are we in the page?
    var scrollTop = $(this).scrollTop();
    // test if we are going down
    if (scrollTop > lastScrollTop){
      // yes we are heading down...
     Session.set("imageLimit", Session.get("imageLimit") + 4);
    }

    lastScrollTop = scrollTop;
  }

});

//end scroll event

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});

//if (Meteor.isClient) {

var img_data = [
    {
    img_src:"laptops.jpg",
    img_alt:"lots of laptops screen"
    },
    {
    img_src:"bass.jpg",
    img_alt:"song of bass"
    },
    {
    img_src:"beard.jpg",
    img_alt:"musician with beard"
    },
];
//}
console.log('I am in the Client');

Template.image_add_form.events({
  'submit .js-add-image':function(event){
    var img_src, img_alt;
    img_src = event.target.img_src.value;
    img_alt = event.target.img_alt.value;
    console.log("src:"+img_src+" alt:"+img_alt);
    if (Meteor.user()) {
      Images.insert({
        img_src: img_src,
        img_alt: img_alt,
        createdOn: new Date(),
        createdBy: Meteor.user()._id
      })
    }
    return false;
  }
});

Template.images.helpers({
  images:function(){
    if (Session.get("userFilter")){// they set a filter!
      return Images.find({createdBy:Session.get("userFilter")}, {sort:{createdOn: -1, rating:-1}});
    }
    else {
      return Images.find({}, {sort:{createdOn: -1, rating:-1}, limit:Session.get("imageLimit")});
    }
  },
  filtering_images:function(){
    if (Session.get("userFilter")) {
      return true;
      }
    else {
      return false;
    }
  },
  getFilterUser:function(){
    if (Session.get("userFilter")) {
      var user = Meteor.users.findOne({_id:Session.get("userFilter")});
      return user.username;
    }
    else {
      return false;
    }
  },
  getUser:function(user_id){
    var user = Meteor.users.findOne({_id:user_id});
    if (user) {
      return user.username;
      }
    else {
      return 'anon';
      }
    }
});

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});

Template.body.helpers({username:function(){
  if (Meteor.user()){
    return Meteor.user().username;
    //return Meteor.user().emails[0].address;
  }
  else {
    return "anonymus internet user";
  }
  }
});


Template.images.events({
  'click .js-image':function(event){
      $(event.target).css("width","75px");
  },
  'click .js-del-image':function(event){
    var image_id = this._id;
    console.log(image_id);
    $('#'+image_id).hide('slow',function(){
      Images.remove({'_id':image_id});
    })
  },
  'click .js-rate-image':function(event){
    var rating = $(event.currentTarget).data('userrating');
    console.log(rating);
    var image_id = this.id;
    console.log(image_id);

    Images.update({_id:image_id},{$set:{rating:rating}})
  },
  'click .js-show-image-form':function(event){
    $('#image_add_form').modal('show');
  },
  'click .js-set-image-user-filter':function(event){
    Session.set("userFilter",this.createdBy);
  },
  'click .js-unset-image-user-filter':function(event){
    Session.set("userFilter",undefined);
  }

});
