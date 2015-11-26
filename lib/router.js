Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
   waitOn: function() { return Meteor.subscribe('posts'); }
});

Router.route('/', {name: 'postsList'})

Router.route('/posts/:_id', {
    name: 'postPage',
    data: function() { return Posts.findOne(this.params._id); }
});


Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  data: function() { return Posts.findOne(this.params._id); }
});

Router.route('/submit/', {name: 'postSubmit'});


var requireLogin = function() {
  if (! Meteor.user()) {
    // If Meteor is in the process of logging user in, show them the loading template, otherwise show accessDenied.  This is necessary to compensate for latency and prevent even momentarily showing an error.

    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
    this.render('accessDenied');
    }
  } else {
    this.next();
  }
};

Router.onBeforeAction(requireLogin, {only: 'postSubmit'});

Router.onBeforeAction('dataNotFound', {only: 'postPage'});
