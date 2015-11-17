
hook = document.getElementById("main")

ws = new WebSocket("ws://localhost:8080/websocket")

ws.onmessage = function(data) {
	hook.innerHTML = data
}