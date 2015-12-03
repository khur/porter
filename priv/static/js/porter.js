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
}

var Connection = function (url) {
  this.url = url;
  this.connect(url);
};

Connection.prototype.connect = function (url){
	if (this.ws != null && this.ws != undefined) {
		this.disconnect();
	}
	this.ws = new WebSocket(url);

	// add listener for reconnections
	this.ws.addEventListener("message", function(e) {
		console.log(e);
		//window.dispatchEvent(e);
	});
};

Connection.prototype.disconnect = function () {
	this.ws.close();
	window.removeEventListener("incoming_message");
}

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


var Registry = function() {
	this.subscribers = {};
};

Registry.prototype.subscribe = function(evtName, callback){
	
}
