// es6
'use strict'
export class Hook {

	constructor(elementId) {
		this.elementId = elementId
		this.element = document.getElementById(elementId)
		if (this.element == null || this.element == undefined) {
			console.error("Failed to hook to element " + elementId)
		}
	}

	render(text) {
		if (this.element == null || this.element == undefined){
			console.error("Invalid element. Cannot render.")
			return
		} 
		this.element.innerHTML = text
	}

}

export class Connection {

	constructor(url) {
		this.url = url
		this.connect(url)
	}

	connect(url){
		if (this.ws != null && this.ws != undefined) {
			this.disconnect()
		}
		this.ws = new WebSocket(url)

		// add listener for reconnections
		this.ws.AddEventListener("message", function(){
			window.broadcast("incoming_message")
		})
	}


	disconnect(){
		this.ws.close()
		window.removeEventListener("incoming_message")
	}

	// callbackAction type string
	// action         type string
	// args           array of items
	// Signature:
	//   action(source), callbackAction(target), args
	rpc(action, callbackAction, args) {
		this.ws.send(JSON.stringify({action, callbackAction, args}))
	}

}

// module.exports = function(){
// 	return {Hook, Connection}
// }

/*
defmodule TheModule do
 def the_remote_proc(action, [args])
end
*/

