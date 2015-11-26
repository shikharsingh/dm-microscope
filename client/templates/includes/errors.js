Template.errors.helpers({
  errors: function() {
    return Errors.find();
  }
});

// Clear the error after 3 seconds
// Since meteor is reactive, it will automatically remove the error from the screen if we remove it from the collection.  So using the remove({id}) method we can do this on the client side collection.
Template.error.onRendered(function() {
  var error = this.data;
  Meteor.setTimeout(function() {
    Errors.remove({id: error.id});
  }, 3000);
});
