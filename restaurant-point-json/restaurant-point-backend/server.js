//import json-server library 
const jsonServer = require("json-server");
const jsonServerPort = 8080;

//start json server
const server = jsonServer.create();//create server
const middlewares = jsonServer.defaults();// takes default middlewares from json
server.use(jsonServer.bodyParser);// server ready bodyParser
server.use(middlewares);//takes all middlewares json server has  

const restaurantsRoutes = require("./routes/restaurants");
//const menusRoutes = require("./routes/menus");
//const menuItemsRoutes = require("./routes/menu-items");

//use routes handlers for json data
restaurantsRoutes(server);
//menusRoutes(server);
//menuItemsRoutes(server);

//start json server on port 8095
server.listen(jsonServerPort,() => {
  console.log(`JSon server running on port ${jsonServerPort}`);
});