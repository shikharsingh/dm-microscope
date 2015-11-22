Posts = new Mongo.Collection('posts');

Meteor.methods({
  postInsert: function(postAttributes) {
    // validate user Id exists and is a string (e.g. user can post)
    check(Meteor.userId(), String);

    //validate post title and url exist and are strings
    check(postAttributes, {
      title: String,
      url: String
    });

    // assign user & post attributes we want to be server side
    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    // Insert the post and return postId
    var postId = Posts.insert(post);
    return {
      _id: postId
    };
  }
});
