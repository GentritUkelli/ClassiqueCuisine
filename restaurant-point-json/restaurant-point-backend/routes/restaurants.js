module.exports = function (server) {
  const { readLastUsedRestaurantsId } = require("../utils");
  let restaurantIdCounter = readLastUsedRestaurantsId();
  const jsonServer = require("json-server");
  const router = jsonServer.router("db.json");

  server.post("/api/restaurants", (request, response) => {
    const requestBody = request.body;
    if (requestBody.id === undefined) {
      let restaurantId = restaurantIdCounter++;

      const newRestaurant = {
        id: restaurantId,
        name: requestBody.name,
        menu: [],
      };

      const restaurantsData = router.db.get("restaurants").value();
      restaurantsData.push(newRestaurant);
      router.db.set("restaurants", restaurantsData).write();
      const lastUsedId = router.db.get("lastUsedId").value();
      lastUsedId.restaurantId = restaurantIdCounter;
      router.db.set("lastUsedId", lastUsedId).write();
      response.json(newRestaurant);
    } else {
      const restaurantsData = router.db.get("restaurants").value();

      console.log(requestBody.id);
      console.log(restaurantsData);

      const index = restaurantsData.findIndex(
        (rest) => rest.id === restaurantId
      );

      console.log(index);

      if (index === -1) {
        response.status(404)({ error: "Restaurant not found" });
      } else {
        request.id = parseInt(requestBody.id);
        restaurantsData[index] = {
          ...restaurantsData[index],
          ...requestBody,
        };

        router.db.set("restaurants", restaurantsData).write();
        response.json(restaurantsData[index]);
      }
    }
  });

  server.delete("/api/restaurants/delete/:id", (request, response) => {
    const restaurantId = parseInt(request.params.id);
    const restaurantsData = router.db.get("restaurants").value();
    const updatedRestaurants = restaurantsData.filter(
      (rest) => rest.id !== restaurantId
    );

    router.db.set("restaurants", updatedRestaurants).write();
    response.json({ message: "Restaurant deleted successfully" });
  });

  server.get("/api/restaurants/all", (request, response) => {
    const restaurantsData = router.db.get("restaurants").value();
    response.json(restaurantsData);
  });

  server.get("/api/restaurants/id/:id", (request, response) => {
    const restaurantId = parseInt(request.params.id);
    const restaurantsData = router.db.get("restaurants").value();
    const restaurant = restaurantsData.find((rest) => rest.id === restaurantId);

    if (!restaurant) {
      response.status(404).json({ error: "Restaurant not found" });
    } else {
      response.json(restaurant);
    }
  });
};