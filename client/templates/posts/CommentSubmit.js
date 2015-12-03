Template.commentSubmit.onCreated(function(){
  // Initialize error session
  Session.set("commentSubmitErrors", {});
});

Template.commentSubmit.helpers({
  // return the error message and set the error class when exist
  errorMessage: function(field) {
      return Session.get('commentSubmitErrors')[field];
  },
  errorClass: function(field) {
    return !!Session.get('commentSubmitErrors')[field] ? 'has-error' : '';
  }
});

// Define comment events
Template.commentSubmit.events({
    // Submit with Enter key.
    'keydown': function(e) {
      if (e.keyCode == 13) {
        e.preventDefault();
        console.log('hit enter');
        $('[name=comment]').submit();
      }
    },
    //
    'submit form': function(e, template) {
      e.preventDefault();

      // grab value
      var $body = $(e.target).find('[name=body]');

      // encapsulate with postId
      var comment = {
        body: $body.val(),
        postId: template.data._id
      };

      // handle erros
      var errors = {};
      if (! comment.body) {
        errors.body = "Please write some content";
        return Session.set('commentSubmitErrors', errors);
      }
      // submit using method
      Meteor.call('commentInsert', comment, function(error, commentId) {
        if (error){
          throwError(error.reason);
        } else {
          // clear the form body
          $body.val('');
        }
          sendMessage("Success! Your comment was posted.");

        // data will be loaded automatically so nothing to do here :)
      });
    }
});
