Template.header.helpers({
  activeRouteClass : function(/* route names */) {
    // create an array hash of the arguments we can work with
    var args = Array.prototype.slice.call(arguments, 0);
    // remove the last element of the array
    args.pop();

    // iterate and return the name of any route matching the name of the current route
    var active = _.any(args, function(name) {
      return Router.current() && Router.current().route.getName() === name
    });

    return active && 'active';
  }
});
