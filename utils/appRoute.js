const ALL_ROUTES = require("./allRoutes");

exports.routes = (app) => {
  app.use(ALL_ROUTES.userAuth);
  app.use(ALL_ROUTES.url);
};
