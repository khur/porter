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

var Porter = function (url) {
  this.url = url;
  this.connect(url);
  this.registry = new Registry();
};

Porter.prototype.connect = function (url){
  var self = this;

	if (this.ws != null && this.ws != undefined) {
		this.disconnect();
	}
	this.ws = new WebSocket(url);

	// add listener for reconnections
  this.ws.onopen = function(e) {
    console.info("connected to:", self.url);
    self.registry.publish("ws::onopen", e);
    self.registry.publish("porter::connection_opened", e.data);
  };

	this.ws.onmessage = function(e) {
    self.registry.publish("ws::onmessage", e);
    self.registry.publish("porter::incoming_message", e.data);
	};

  this.ws.onerror = function(e) {
    self.registry.publish("ws::onerror", e);
    self.registry.publish("porter::connection_error", e.data);
  };

  this.ws.onclose = function(e) {
    self.registry.publish("ws::onclose", e);
    self.registry.publish("porter::connection_closed", e.data);
    self.connect(self.url);
  };
};

Porter.prototype.disconnect = function() {
	this.ws.close();
  this.registry.clearSubscribers();
};

Porter.prototype.subscribe = function(name, listener) {
  this.registry.subscribe(name, listener);
};

Porter.prototype.unsubscribe = function(name, listener) {
  this.registry.unsubscribe(name, listener);
};

/* Rpc details
  callbackAction type string
  action         type string
  args           array of items
  Signature:
    action(source), callbackAction(target), args
*/
Porter.prototype.rpc = function(action, callbackAction, args) {
  this.registry.publish("porter::sending_rpc",
      {"action": action, "callback_action": callbackAction, "args": args});
	this.ws.send(JSON.stringify({action, callbackAction, args}));
}
