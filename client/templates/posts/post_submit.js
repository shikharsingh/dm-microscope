Template.postSubmit.onCreated(function() {
  // Initialize the postSubmitErrors session object and clear any old errors that may have been left behind.
  Session.set('postSubmitErrors', {});
});
Template.postSubmit.helpers({
  // Define template helper to display the error message
  errorMessage: function(field) {
    return Session.get('postSubmitErrors')[field];
  },
  // Define template helper to add the class if there is an error. If error exists, add 'has-error' otherwise no class.
  errorClass: function(field) {
      // note "!!" in this context ensures the value is a boolean when evaluated... if we had a 0 not as text this wouldn't evaluate as an expression.
      return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
  }

});
Template.postSubmit.events({
  'submit form': function(e) {
    // Don't submit it like a retard.
    e.preventDefault();

    // Define post from form properties
    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };

    // Validate the post using the function defined in the collection
    var errors = validatePost(post);

    // If there was an error, display them and tell user gtfo.
    if (errors.title || errors.url) {
      return Session.set('postSubmitErrors', errors);
    }

    Meteor.call('postInsert', post, function(error, result) {
      // display the error to the user and abort
      console.log(error);
      if (error)
        return throwError(error.reason);
      if (result.postExist)
        throwError('This link has already been posted!');
      else
        sendMessage("Your link was successfully posted!");

      Router.go('postPage', {_id: result._id});
    });
  }
});
