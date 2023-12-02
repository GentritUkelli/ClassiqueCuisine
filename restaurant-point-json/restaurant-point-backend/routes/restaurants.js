module.exports = function(server){

  const {readLastUsedRestaurantsId} = require("../utils");

  let restaurantsIdCounter = readLastUsedRestaurantsId();

  const jsonServer = require("json-server");
  
  const router = jsonServer.router("db.json");

  server.delete("/api/restaurants/delete/:id", (request, response) => {
    const restaurantsId = parseInt(request.params.id);

    const restaurantsData = router.db.get("restaurants").value();

    const updateRestaurants = restaurantsData.filter(
      (res) => res.id !== restaurantsId
    );

    router.db.set("restaurants",updateRestaurants).write();

    response.json({message: "Restaurants deleted successfully"})
  })

}