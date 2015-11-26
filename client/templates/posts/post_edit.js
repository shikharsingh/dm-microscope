Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentPostId = this._id;

    // Set the post properties from the view
    var postProperties = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    }

    Meteor.call('postUpdate', postProperties, currentPostId, function(error, result) {
      // handle error exits
      if (error)
        alert('This post was not updated! ');
      if (results.postExists)
        alert('this post already exists!');

      // redirect user to home page
      Router.go('postsList');
    });

  },
    'click .delete': function(e) {
      e.preventDefault();

      if (confirm("Delete this post?")) {
        var currentPostId = this._id;
        Posts.remove(currentPostId);
        Router.go('postsList');
      }
    }
});
