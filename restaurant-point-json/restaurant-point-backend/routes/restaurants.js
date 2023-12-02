module.exports = function(server){
  const {readLastUsedRestaurantsId} = require("../utils");

  let restaurantIdCounter = readLastUsedRestaurantsId();

  const jsonServer = require("json-server");

  const router = jsonServer.router("db.json");

  server.delete("/api/restaurants/delete/:id", (request, response) => {
    const restaurantId = parseInt(request.params.id);

    const restaurantData = router.db.get("restaurants").value();

    const updatedRestaurants = restaurantData.filter(
      (res) => res.id !== restaurantId
    );

    router.db.set("restaurants", updatedRestaurants).write();

    response.json({message:"Restaurants deleted successfully"});
  });

  server.get("/api/departments/all", (request, response) => {
    const restaurantData = router.db.get("restaurants").value();

    response.json(restaurantData);

  });
}