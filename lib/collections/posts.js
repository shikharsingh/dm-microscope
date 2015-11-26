Posts = new Mongo.Collection('posts');

 Posts.allow({
  // Commented to implement a meteor method
   update: function(userId, post) { return ownsDocument(userId, post); },
   remove: function(userId, post) { return ownsDocument(userId, post); },
});

Posts.deny({
  update: function(userId, post, fieldNames) {
    // Only allow the following two fields to be edited
    // Here we are using underscore's without method to return a sub-array containing fields that are not url and title.  If there are any additional fields, the length will be greater than 0 thereby disallowing the edit.
    // e.g. deny will return true if length is > 0.
    return (_.without(fieldNames), 'url', 'title').length > 0;
  }, 
  update: function(userId, post, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    return errors.title || errors.url;
  }
});

validatePost = function(post) {
  var errors = {};
  if (!post.title)
    errors.title = "Please fill in a headline";
  if (!post.url)
    errors.url = "Pleae fill in a URL";
  return errors;
}

Meteor.methods({
  postInsert: function(postAttributes) {
    // validate user Id exists and is a string (e.g. user can post)
    check(Meteor.userId(), String);

    //validate post title and url exist and are strings
    check(postAttributes, {
      title: String,
      url: String
    });

    var errors = validatePost(postAttributes);

    if (errors != {})
      throw new Meteor.Error('invalid-post', "You must set a title and URL for your post");


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
  },

  postUpdate: function(postAttributes, postId) {
    // validate user Id exists and is a string (e.g. user can post)
    check(Meteor.userId(), String);

    //validate post title and url exist and are strings
    check(postAttributes, {
      title: String,
      url: String
    });

    check(postId, String);

    var postWithSameLink = Posts.findOne({url : postAttributes.url});

    if (postWithSameLink && postWithSameLink._id != postId) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      }
    }

    Posts.update(postId, {$set: postAttributes});

  }


});

// Implement a hook using matb33:collection-hooks in order to execute some logic right before the insert.
Posts.before.insert(function (userId, post){
  post.createdAt = Date.now();
});

Posts.after.insert(function(userId, post){
  console.log('post ' + post._id + ' successfully inserted! now the console knows');
});
