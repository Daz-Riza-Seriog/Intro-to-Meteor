import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

Images = new Mongo.Collection("images");

console.log('main.js Server say: '+Images.find().count());

console.log('main.js Server say: '+"I am the Server");

Meteor.startup(() => {
  if (Images.find().count()==0) {
    for (var i = 1; i < 23; i++) {
      Images.insert(
        {
        img_src:"img_"+i+".jpg",
        img_alt:"image number"+i
        }
      );
    }; //End cycle for 'insert images'
  };
  //console.log(Images.find().count());
  // code to run on server at startup
});
