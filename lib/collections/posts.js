Posts = new Mongo.Collection('posts');

Posts.allow({
  insert: function(userId, doc) {
    // only allow users to post if they are logged in
    return !! userId;
  }
});
