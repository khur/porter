'use strict'

var Hook = function (elementId) {
  this.elementId = elementId;
  this.element = document.getElementById(elementId);
  if (this.element == null || this.element == undefined) {
		console.error("Failed to hook to element " + elementId)
	}
};

Hook.prototype.render = function (text) {
	if (this.element == null || this.element == undefined) {
		console.error("Invalid element. Cannot render.");
		return;
	} 
	this.element.innerHTML = text;
};

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
  var event = new CustomEvent(name, {"details": data});
  window.dispatchEvent(event);
};

Registry.prototype.clearSubscribers = function() {
  var self = this;
  for(var key in this.subscribers) {
    if(Object.prototype[key]) return;
    this.subscribers[key].forEach(function(listener) {
      self.unsubscribe(key, listener)
    }
  }
  this.subscribers = {};
};

var Connection = function (url) {
  this.url = url;
  this.connect(url);
  this.registry = new Registry();
};

Connection.prototype.connect = function (url){
	if (this.ws != null && this.ws != undefined) {
		this.disconnect();
	}
	this.ws = new WebSocket(url);

	// add listener for reconnections
  this.ws.onopen = function(e) {
    console.log(e);
    this.registry.publish("ws_open", e.data);
  };

	this.ws.onmessage = function(e) {
    console.log(e);
    this.registry.publish("ws_message", e.data);
	};

  this.ws.onerror = function(e) {
    console.log(e);
    this.registry.publish("ws_error", e.data);
  };

  this.ws.onclose = function(e) {
    console.log(e);
    this.connect(this.url);
  };
};

Connection.prototype.disconnect = function () {
	this.ws.close();
  this.registry.clearSubscribers();
};

/* Rpc details
  callbackAction type string
  action         type string
  args           array of items
  Signature:
    action(source), callbackAction(target), args
*/
Connection.prototype.rpc = function(action, callbackAction, args) {
	this.ws.send(JSON.stringify({action, callbackAction, args}));
}
