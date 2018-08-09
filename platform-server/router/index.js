var routes = require('./routeConfig');
const express = require('express');
const router = express.Router();

var routeHandlers = {
  blog: require('../src/blog'),
}

for(var path in routes) {
  var sub_routes = routes[path].routes;

  sub_routes.forEach(route => {

    var method = route.method;
    var sub_route = route.route;
    var handlers = [];

    route.handlers.forEach(handler => {
      var func = routeHandlers[handler.base][handler.name];
      if(func) {
        handlers.push(func);
      }
    });

    router[method](path + sub_route, ...handlers);

  });
}

module.exports = router;
