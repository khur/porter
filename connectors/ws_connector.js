var WsConnector = function(url){
  this.url = url;
  this.ws = null;
}

WsConnector.prototype.connect = function(registry) {

  if (!registry) throw "WsConnector requires a valid registry.";
  this.registry = registry;

  var self = this;
  // clean up before a reconnect
  if (this.ws != null && this.ws != undefined) {
    this.disconnect();
  }
  this.ws = new WebSocket(self.url);

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
    self.connect();
  };  
};

WsConnector.prototype.disconnect = function() {
  if (this.ws) this.ws.close();
};

WsConnector.prototype.send = function(payload) {
  this.ws.send(payload);
};
