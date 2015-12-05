# Porter

Render HTML on the server and push it directly to a frontend element.

### Installation

Install with npm

```
npm install --save porter
```

Install with bower

```
bower install --save porter
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

    <script src="/js/porter.js"></script>
    <script src="/js/hook.js"></script>
    <script src="/js/connectors/ws_connector.js"></script>

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
