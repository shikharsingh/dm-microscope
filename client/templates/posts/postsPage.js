Template.postPage.helpers({
  //Get all comments for a post.
  comments: function() {
      var comments = Comments.find({postId: this._id});
      console.log(comments.fetch());
      return comments;
  }
});
