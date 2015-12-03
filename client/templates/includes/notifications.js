Template.notifications.helpers({
  notifications: function() {
    return getNotificationsbyUserId(Meteor.userId());
  },
  notificationCount: function() {
    return getNotificationsbyUserId(Meteor.userId()).count();
  }
});

Template.notificationItem.helpers({
  notificationPostPath: function() {
    // return the postPath for the given postId in current context.
    return Router.routes.postPage.path({_id: this.postId});
  }
});

Template.notificationItem.events({
  'click a': function() {
    Notifications.update(this._id, {$set: {read: true}});
  }
});

// define a function to return notificaitons by user id
function getNotificationsbyUserId(userId) {
  return Notifications.find({userId: userId, read: false});
};
