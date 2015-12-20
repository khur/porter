'use strict'

var Registry = function() {
  this.subscribers = {};
};

Registry.prototype.findSubscriber = function(name) {
  return this.subscribers[name];
};

Registry.prototype.subscribe = function(name, listener) {
  var subscriber = this.findSubscriber(name);

  if(subscriber) {
    subscriber.push(listener);
  } else {
    subscriber = [listener];
  }
  
  this.subscribers[name] = subscriber;
  window.addEventListener(name, listener);
};

Registry.prototype.unsubscribe = function(name, listener) {
  var subscriber = this.findSubscriber(name);

  if(subscriber) {
    subscriber = subscriber.filter(function(item) { return item != listener; });
    this.subscribers[name] = subscriber;
    window.removeEventListener(name, listener);
  }
};

Registry.prototype.publish = function(name, data) {
  var event = new CustomEvent(name, {"detail": data});
  window.dispatchEvent(event);
};

Registry.prototype.clearSubscribers = function() {
  var self = this;
  for(var key in this.subscribers) {
    if(Object.prototype[key]) return;
    this.subscribers[key].forEach(function(listener) {
      self.unsubscribe(key, listener)
    });
  }
  this.subscribers = {};
};


var Dispatcher = function() {
  this.actions = {};
};

Dispatcher.prototype.add = function(name, callback){
  this.actions[name] = callback;
};

Dispatcher.prototype.remove = function(name){
  delete(this.actions, name);
};

Dispatcher.prototype.execute = function(name, args){
  this.actions[name](args);
};


var Porter = function (connection) {
  this.registry     = new Registry();
  this.connection   = connection
  this.dispatcher   = new Dispatcher();
};

Porter.prototype.connect = function (){
  var self = this;
  this.registry.subscribe("porter::incoming_message", function(e) {
    self.execute(e.detail);
  });
  this.connection.connect(this.registry);
};

Porter.prototype.disconnect = function() {
  this.connection.disconnect()
  this.registry.clearSubscribers();
};

Porter.prototype.subscribe = function(name, listener) {
  this.registry.subscribe(name, listener);
};

Porter.prototype.unsubscribe = function(name, listener) {
  this.registry.unsubscribe(name, listener);
};

/* 

  * Broadast details
  * topic        type string
  * clientAction type string
  * args         array of items
  * Signature:
  *  serverAction(serverTarget), clientAction(clientTarget), args

*/
Porter.prototype.broadcast = function(topic, action, args) {
  var generalbroadcast  = "porter::broadcast";
  var topicBroadcast    = broadcast + "::" + topic;
  var payload           = {"topic": topic, "action": action, "args": args};

  this.registry.publish(broadcast, payload)
  this.registry.publish(topicBroadcast, payload)
  this.connection.send(JSON.stringify(payload));

};


/*

  dispatch expects JSON in the form:
  * '{ action: "SomeString", args:["a", "list","of","args",1] }'
  * action       type string
  * args         type all
  * Signature:
  *  function(action, args)

*/
Porter.prototype.dispatch = function(data) {
  var incomingData = JSON.parse(data);
  this.dispatcher.execute(incomingData.action, incomingData.args);
};


module.exports = Porter;
