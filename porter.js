'use strict'

var Channel = function(name) {
  /*
    The Channel class manages the addition and 
    removal of EventListeners with actions and callbacks
    on the window object.
    The Channel class's `publish` method turns actions
    and data into dispatched events namespaced to the channel's
    name ('theChannelName::theAction')
  */
  if (!name instanceof String) {
    console.error("Channels only accept strings as names; not", name);
  }
  this.name         = name;
  this.subscribers  = {};
};

Channel.prototype.formatAction = function(action) {
  return [this.name, action].join("::");
};

Channel.prototype.findSubscriber = function(action) {
  return this.subscribers[action];
};

Channel.prototype.subscribe = function(action, callback) {
  var subscriber = this.findSubscriber(action);

  if (subscriber) {
    subscriber.push(callback);
  } else {
    subscriber = [callback];
  }
  
  this.subscribers[action] = subscriber;
  var chanAction = this.formatAction(action)
  window.addEventListener(chanAction, callback);
};

Channel.prototype.unsubscribe = function(action, callback) {
  var subscriber = this.findSubscriber(action);

  if (subscriber) {
    subscriber = subscriber.filter(function(item) { return item != callback; });
    this.subscribers[action] = subscriber;
    var chanAction = this.formatAction(action)
    window.removeEventListener(chanAction, callback);
  }
};

Channel.prototype.publish = function(action, data) {
  var chanAction = this.formatAction(action);
  var event = new CustomEvent(chanAction, {"detail": data});
  window.dispatchEvent(event);  
};

Channel.prototype.clearSubscribers = function() {
  var self = this;
  for(var key in this.subscribers) {
    if(Object.prototype[key]) return;
    this.subscribers[key].forEach(function(callback) {
      self.unsubscribe(key, callback)
    });
  }
  this.subscribers = {};
};


// var Porter = function (name) {
//   this.channel      = new Channel(name || "porter");
//   this.channels     = {};
//   this.connectors   = {};
// };

// Porter.prototype.addChannel = function(channel){
//   if (channel instanceof Channel) {
//     if (channel.name == this.channel.name) {
//       console.error("Porter: the channel", channel.name, "already belongs to this instance of Porter");
//       return;
//     } 
//     this.channels[channel.name] = channel;
//   } else {
//     console.error("Porter: invalid channel - cannot addChannel", channel);
//   }
// };

// Porter.prototype.removeChannel = function(channel) {
//   if (channel instanceof Channel) {
//     delete this.channels[channel.name];
//   } else if (channel instanceof String) {
//     delete this.channels[channel];
//   }
// };


function grab(e) {
  return e.detail;
}

var GenericConnector = function(channel){
  this.name = "genconn";
  this.channels = {};
  if (channel) this.addChannel(channel);
};

GenericConnector.prototype.addChannel = function(channel) {
  if (channel instanceof Channel) {
    this.channels[channel.name] = channel;
  } else {
    console.error("GenericConnector: invalid channel - cannot addChannel", channel);
  }
};

GenericConnector.prototype.removeChannel = function(channel) {
  if (channel instanceof Channel) {
    delete this.channels[channel.name];
  } else if (channel instanceof String) {
    delete this.channels[channel];
  }
};

GenericConnector.prototype.connect = function() {
  var self = this;

  //spoofs IO connection
  setTimeout(function() {
    self.publish("connect", {name: self.name});
  }, 10);
};

GenericConnector.prototype.disconnect = function() {
  var self = this;
  //spoofs IO connection
  setTimeout(function() {
    self.publish("disconnect", {name: self.name});
  }, 10);
};

GenericConnector.prototype.send = function(payload) {
  var self = this;
  self.publish("send", {name: self.name, payload: payload});
  setTimeout(function() {
    self.publish("receive", {name: self.name, payload: payload});
  }, 1000);
};

GenericConnector.prototype.publish = function(action, payload) {
  for(var name in Object.keys(this.channels)) {
    this.channels[name].publish(action, payload);
  }
}


// Porter.prototype.connect = function (){
//   var self = this;
//   this.registry.subscribe("incoming_message", function(e) {
//     self.execute(e.detail);
//   });
//   this.connection.connect(this.registry);
// };

// Porter.prototype.disconnect = function() {
//   this.connection.disconnect()
//   this.registry.clearSubscribers();
// };

// Porter.prototype.subscribe = function(name, listener) {
//   this.registry.subscribe(name, listener);
// };

// Porter.prototype.unsubscribe = function(name, listener) {
//   this.registry.unsubscribe(name, listener);
// };

 

//   * Broadast details
//   * topic        type string
//   * clientAction type string
//   * args         array of items
//   * Signature:
//   *  serverAction(serverTarget), clientAction(clientTarget), args


// Porter.prototype.broadcast = function(topic, action, args) {
//   var generalbroadcast  = "porter::broadcast";
//   var topicBroadcast    = broadcast + "::" + topic;
//   var payload           = {"topic": topic, "action": action, "args": args};

//   this.registry.publish(broadcast, payload)
//   this.registry.publish(topicBroadcast, payload)
//   this.connection.send(JSON.stringify(payload));

// };


// /*

//   dispatch expects JSON in the form:
//   * '{ action: "SomeString", args:["a", "list","of","args",1] }'
//   * action       type string
//   * args         type all
//   * Signature:
//   *  function(action, args)

// */
// Porter.prototype.dispatch = function(data) {
//   var incomingData = JSON.parse(data);
//   this.dispatcher.execute(incomingData.action, incomingData.args);
// };


//  Porter:   Porter,
// Producer: Producer,


if (typeof module != 'undefined') {
  module.exports = {
    Channel:  Channel,
    GenericConnector: GenericConnector
  };
}
