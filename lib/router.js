Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',

  // Define subscriptions the router should wait on before rendering the page.
   waitOn: function() {
    return [Meteor.subscribe('notifications')]
  }
});

// Todo: figure out why ordering of router routes matters?
Router.route('/submit/', {name: 'postSubmit'});

PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5,
  postsLimit: function() {
    return parseInt(this.params.postLimit) || this.increment;
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.postsLimit()};
  },
  posts: function() {
    return Posts.find({}, this.findOptions());
  },
  subscriptions: function() {
    this.postsSub = Meteor.subscribe('posts', this.findOptions());
  },
  data: function() {
    var hasMore = this.posts().count() === this.postsLimit();
    /* if (hasMore) {
      var newLimit = this.postsLimit() + 1;
      console.log(newLimit);
      var hasOneMore = (Posts.find({}, {sort: {submitted: -1}, limit: newLimit}));
      if (hasOneMore.count() === this.posts().count()){
        console.log('has one more:' + hasOneMore.count())
        hasMore = false;
      }
    }*/
    return {
      posts: this.posts(),
      ready: this.postsSub.ready,
      nextPath: hasMore ? this.nextPath() : null
    };
  }
});

// Extend postslist for new posts
NewPostsController = PostsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});

// Extend postsList for best posts
BestPostsController = PostsListController.extend({
  sort: {votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
})

Router.route('/', {
  name: 'home',
  controller: NewPostsController
});

Router.route('/new/:postsLimit?', {name: 'newPosts'});
Router.route('/best/:postsLimit?', {name: 'bestPosts'});

Router.route('/posts/:_id', {
    name: 'postPage',
    data: function() { return Posts.findOne(this.params._id); },
    waitOn: function() {
      return [Meteor.subscribe('comments', this.params._id),
              Meteor.subscribe('singlePost', this.params._id)];
    }
});


Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  waitOn: function() {
    return Meteor.subscribe('singlePost', this.params._id);
  },
  data: function() {
    console.log(this.params._id);
    var posts = Posts.findOne(this.params._id);
    console.log(posts);
    return Posts.findOne(this.params._id); }
});



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
