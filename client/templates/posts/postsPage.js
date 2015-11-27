Template.postPage.helpers({
  //Get all comments for a post.
  comments: function() {
      return Comments.find({postId: this_id});
  }
});
