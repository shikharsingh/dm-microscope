Meteor.publish('posts', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  console.log(options);
  return Posts.find({}, options);
});

Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find(
      {_id: this.userId},
        {fields: {'createdAt': 1}});
  } else {
    this.ready();
  }
});

Meteor.publish("singlePost", function(id) {
  check(id, String);
  return Posts.find(id);
});

// To do: implement a reactive method to publish the number of users currently logged in and display in a badge on the screen with the current user count.
/* Meteor.publish('usersLoggedIn', function(){
  var users = Meteor.users.find()
  var users.

}); */

// Publish comments when provided a postId
Meteor.publish('comments', function(postId) {
  check(postId, String);
  return Comments.find({postId: postId});
});

// Publish unread notifications belonging to current user
Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
});
