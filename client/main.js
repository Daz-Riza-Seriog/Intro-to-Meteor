import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

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

if (Meteor.isClient) {
  console.log('I am in the Client');
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
  Template.images.helpers({images:img_data});

  Template.images.events({
    'click .js-image':function(event){
        $(event.target).css("width","75px");
    }
  });

}
