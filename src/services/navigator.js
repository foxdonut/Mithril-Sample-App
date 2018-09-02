import m from "mithril"
import { compile } from "path-to-regexp"

const compose = (f, g) => x => f(g(x));

export const createNavigator = update => {
  // Map of page id -> component
  const componentMap = {};

  // Mithril Router routes
  const routes = {};

  // Functions to generate URL from page id and params
  const toPath = {};

  // Component to use for invalid page ids
  let notFoundComponent = undefined;

  const getUrl = (pageId, params = {}) => {
    const stringify = toPath[pageId];
    return stringify && stringify(params);
  };

  return {
    // configs have a key, a component, and a route.
    register: (configs, notFound) => {
      if (notFound) {
        configs.push({ key: "NotFoundPage", component: notFound, route: "/:404..." });
      }
      configs.forEach(config => {
        const component = config.component;
        componentMap[config.key] = component;

        if (config.route) {
          routes[config.route] = config.key;
          toPath[config.key] = compile(config.route);
        }
      });
      notFoundComponent = notFound;
    },
    getComponent: pageId => componentMap[pageId] || notFoundComponent,
    onnavigate: (pageId, params, url) => {
      const Component = componentMap[pageId];
      const updateFunc = model =>
        Object.assign(model, { pageId, url: "#!" + url });

      if (Component && Component.navigating) {
        return new Promise(resolve => {
          Component.navigating(params, func => {
            update(compose(func, updateFunc));
            resolve();
          });
        });
      }
      else {
        update(updateFunc);
      }
    },
    navigateTo: (pageId, params) => {
      m.route.set(getUrl(pageId, params));
    },
    getUrl,
    routes
  };
};
