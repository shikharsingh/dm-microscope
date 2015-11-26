Template.postsList.helpers({
  // declare an anonymous function to fetch the posts
  posts: function() {
    return Posts.find({}, {sort: {submitted: -1}});
  }
});
