# Porter

Render HTML on the server and push it directly to a frontend element.

### Installation

```
npm install --save porter-client
```


### Usage

```html
<html>
  <head>
    <title>It's Porter TIME!!!</title>
  </head>
  <body>
    <div id='main'>
      ..Main..
    </div>

    <script src="/static/js/porter.js"></script>
    <script src="/static/js/hook.js"></script>

    <script>
      var connector = new WsConnector("ws://localhost:8080/websocket")
      var hook = new Hook("main");
      var porter = new Porter(connector);
      porter.whitelist.add_rpc("hook.render", function(args) {
        hook.render(args);
      });

      porter.connect();
    </script>
  </body>
</html>
```