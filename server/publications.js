Meteor.publish('posts', function() {
  return Posts.find();
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

// Publish comments when provided a postId
Meteor.publish('comments', function(postId) {
  check(postId, String);
  return Comments.find({postId: postId});
});

// Publish all notifications
Meteor.publish('notifications', function() {
  return Notifications.find();
});
