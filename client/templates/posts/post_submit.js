Template.postSubmit.events({
  'submit form': function(e) {
    // Don't submit it like a retard.
    e.preventDefault();

    // Define post from form properties
    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };

    Meteor.call('postInsert', post, function(error, result) {
      // display the error to the user and abort
      if (error)
        return alert(error.reason);
      if (result.postExist)
        alert('This link has already been posted!');

      Router.go('postPage', {_id: result._id});
    });
  }
});
