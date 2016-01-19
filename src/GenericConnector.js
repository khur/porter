class GenericConnector {
  constructor(channel) {
    this.name = "genconn";
    this.channels = {};
    if (channel) this.addChannel(channel);
  }

  addChannel(channel) {
    channel instanceof Channel ?
      this.channels[channel.name] = channel
    : console.error("GenericConnector: invalid channel - cannot addChannel", channel);
  }

  removeChannel(channel) {
    if (channel instanceof Channel) {
      delete this.channels[channel.name];
    } else if (channel instanceof String) {
      delete this.channels[channel];
    }
  }

  connect() {
    let self = this;

    //spoofs IO connection
    setTimeout(function() {
      self.publish("connect", {name: self.name});
    }, 10);
  }

  disconnect() {
    let self = this;
    //spoofs IO connection
    setTimeout(function() {
      self.publish("disconnect", {name: self.name});
    }, 10);
  }

  send(payload) {
    let self = this;
    self.publish("send", {name: self.name, payload: payload});
    setTimeout(function() {
      self.publish("receive", {name: self.name, payload: payload});
    }, 1000);
  }

  publish(action, payload) {
    for(var name in Object.keys(this.channels)) {
      this.channels[name].publish(action, payload);
    }
  }
}