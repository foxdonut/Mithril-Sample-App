// index.jsx

import m from "mithril";
import stream from "mithril-stream";
import O from "patchinko/constant"
import createApp from './components/layout/App.jsx';

// Styles
import "./index.css";

// Meiosis Pattern Setup
const update = stream();
const App = createApp(update);
const models = stream.scan(O, App.model(), update);

const root = document.getElementById("app");
m.route(root, "/auth", Object.keys(App.navigator.routes).reduce((result, route) => {
  result[route] = {
    onmatch: (params, url) =>
      App.navigator.onnavigate(App.navigator.routes[route], params, url),
    render: () => m(App, { model: models() })
  };
  return result;
}, {}));

// For development only, to use Meiosis-Tracer in Chrome DevTools
import meiosisTracer from "meiosis-tracer";
meiosisTracer({ streams: [ models ]});

models.map(model => {
  const url = model.url;
  if (url && document.location.hash !== url) {
    window.history.pushState({}, "", url);
  }
});
models.map(() => { m.redraw(); });

