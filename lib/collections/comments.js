Comments = new Mongo.Collection('comments');

Meteor.methods({
  commentInsert: function(commentAttributes) {
    // check post attributes to ensure they are strings
    check(commentAttributes, {
      postId: String,
      body: String
    });

    var user = Meteor.user();
    var post = Posts.findOne(commentAttributes.postId);

    if(!post)
      throw new Meteor.Error('invalid-comment', 'you must comment on an existing post');

    // use _'s extend function to add in sensitive variables
    comment = _.extend(commentAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    //Update the post's comment count
    Posts.update(comment.postId, {$inc: {commentsCount: 1}});

    // insert the comment and store the returned ID
    comment._id = Comments.insert(comment);

    // create comment notification
    createCommentNotification(comment);

    return comment._id;
  }
})
