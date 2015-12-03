Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',

  // Define subscriptions the router should wait on before rendering the page.
   waitOn: function() {
    return [Meteor.subscribe('notifications')]
  }
});

PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5,
  postsLimit: function() {
    return parseInt(this.params.postLimit) || this.increment;
  },
  findOptions: function() {
    return {sort: {submitted: -1}, limit: this.postsLimit()};
  },
  waitOn: function() {
    return Meteor.subscribe('posts', this.findOptions());
  },
  data: function() {
    return {posts: Posts.find({}, this.findOptions())};
  }
});

 //define an optional post limit qs var
Router.route('/:postLimit?', {
  name: 'postsList'
});


Router.route('/posts/:_id', {
    name: 'postPage',
    data: function() { return Posts.findOne(this.params._id); },
    waitOn: function() {
      return Meteor.subscribe('comments', this.params._id);
    }
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

// Require user is logged in before submitting posts.
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});

//Route 404 errors
Router.onBeforeAction('dataNotFound', {only: 'postPage'});
