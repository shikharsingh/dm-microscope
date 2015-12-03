Notifications = new Mongo.Collection('notifications');

// Allow clients to update notifications with read status.
Notifications.allow({
  update: function(userId, doc, fieldNames){
    return ownsDocument(userId, doc) &&
      fieldNames.length === 1 && fieldNames[0] === 'read';
    }
});

//Define a func to create new comment notifications
createCommentNotification = function(comment) {
  // Find the post
  var post = Posts.findOne(comment.postId);

  // Notify the poster if anyone other than the posting user comments
  if (comment.userId !== post.userId) {
    Notifications.insert({
      userId: post.userId,
      postId: post._id,
      commentId: comment._id,
      commenterName: comment.author,
      read: false
    });
  }
};
