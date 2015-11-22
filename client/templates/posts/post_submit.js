Template.postSubmit.events({
  'submit form': function(e) {
    // Don't submit it like a retard.
    e.preventDefault();

    // Define post from form properties
    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };

    //grab the post id after inserting the post
    post._id = Posts.insert(post);

    //redirect to the named route, post page
    Router.go('postPage', post);
  }
});
