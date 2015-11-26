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

    var postWithSameLink = Posts.findOne({url : postAttributes.url});

    if (postWithSameLink) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      }
    }

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

// Implement a hook using matb33:collection-hooks in order to execute some logic right before the insert.
Posts.before.insert(function (userId, post){
  post.createdAt = Date.now();
});

Posts.after.insert(function(userId, post){
  console.log('post ' + post._id + ' successfully inserted! now the console knows');
});
