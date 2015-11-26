Errors = new Mongo.Collection(null);

throwError = function(message){
  Errors.insert({message: message, type: 'danger'});
};

sendMessage = function(message){
  Errors.insert({message: message, type: 'success'});
};
