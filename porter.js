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

var RpcWhitelist = function() {
  this.rpcs = {};
};

RpcWhitelist.prototype.add_rpc = function(name, callback){
  this.rpcs[name] = callback;
};

RpcWhitelist.prototype.remove_rpc = function(name){
  delete(this.rpcs, name);
};

RpcWhitelist.prototype.call_rpc = function(name, args){
  this.rpcs[name](args);
};

var Porter = function (connection) {
  this.registry   = new Registry();
  this.connection = connection
  this.whitelist  = new RpcWhitelist();
};

Porter.prototype.connect = function (){
  var self = this;
  this.registry.subscribe("porter::incoming_message", function(e) {
    self.execute_rpc(e.detail);
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

/* Rpc details
 * serverAction type string
 * clientAction type string
 * args         array of items
 * Signature:
 *  serverAction(serverTarget), clientAction(clientTarget), args
 */
Porter.prototype.rpc = function(serverAction, clientAction, args) {
  this.registry.publish("porter::sending_rpc",
      {"serverAction": serverAction, "clientAction": clientAction, "args": args});
  this.connection.send(JSON.stringify({serverAction, clientAction, args}));
}

/* Return Rpc details
 * clientAction type string
 * args         type all
 * Signature:
 *  clientAction(target), args
 */
Porter.prototype.execute_rpc = function(data) {
  var rpc_data = JSON.parse(data);
  this.whitelist.call_rpc(rpc_data.clientAction, rpc_data.args);
};


module.exports = Porter;
