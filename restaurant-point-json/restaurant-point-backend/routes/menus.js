const { request, response } = require("express");
module.exports = function (server) {
  const { readLastUsedMenusID } = require("../utils");
  const jsonServer = require("json-server");
  const router = jsonServer.router("db.json");
  let restaurantIdCounter = readLastUsedMenusID();

  server.post("/api/menus/:id", (request, response) => {
    const restaurantId = parseInt(request.params.id);
    const requestBody = request.body;
    const restaurantsData = router.db.get("restaurants").value();
    const index = restaurantsData.findIndex((restaurant) => restaurant.id === restaurantId);

    // check if the restaurant exists
    if (index === -1) {
      response.status(404).json({ error: "Restaurant not found" });
    } else {
      const restaurant = restaurantsData[index];
      const menuList = restaurant.menus;

      if (requestBody.id === undefined) {
        let menuId;
        menuId = restaurantIdCounter++;
        const newMenu = {
          id: menuId,
          name: requestBody.name,
          menu_items: [],
        };
        menuList.push(newMenu);
        restaurant.menus = menuList;
        router.db.set("restaurants", restaurantsData).write();
        const lastUsedId = router.db.get("lastUsedId").value();
        lastUsedId.restaurantId = restaurantIdCounter;
        router.db.set("lastUsedId", lastUsedId).write();
        response.json(restaurantsData[index]);
      } else {
        const menuIndex = restaurant.menus.findIndex(
          (menu) => menu.id === parseInt(requestBody.id)
        );

        if (menuIndex === -1) {
          response
            .status(404)
            .json({ error: "Menu not found in this restaurant" });
        } else {
          requestBody.id = parseInt(requestBody.id);
          const updatedMenu = {
            id: requestBody.id,
            name: requestBody.name,
            menu_items: [],
          };
          restaurant.menus[menuIndex] = {
            ...restaurant.menus[menuIndex],
            ...updatedMenu,
          };
          router.db.set("restaurants", restaurantsData).write();
          response.json(restaurant);
        }
      }
    }
  });

  server.get("/api/menus/list/:id", (request, response) => {
    const restaurantId = parseInt(request.params.id);
    const restaurantsData = router.db.get("restaurants").value();
    const restaurant = restaurantsData.find((rest) => rest.id === restaurantId);
    if (!restaurant) {
      response.status(404).json({ error: "Restaurant not found" });
    } else {
      const menuList = restaurant.menus;
      response.json(menuList);
    }
  });

  server.get("/api/menus/:rest_id/:id", (request, response) => {
    const restaurantId = parseInt(request.params.rest_id);
    const menuId = parseInt(request.params.id);
    const restaurantsData = router.db.get("restaurants").value();
    const restaurant = restaurantsData.find((rest) => rest.id === restaurantId);

    if (!restaurant) {
      response.status(404).json({ error: "Restaurant not found" });
    } else {
      const menu = restaurant.menus.find(
        (menu) => menu.id === menuId
      );

      if (!menu) {
        response
          .status(404)
          .json({ error: "Menu not found in this restaurant" });
      } else {
        response.json(menu);
      }
    }
  });

  server.delete("/api/menus/delete/:id", (request, response) => {
    const menuId = parseInt(request.params.id);
    const restaurantData = router.db.get("restaurants").value();
    let menuDeleted = false;

    restaurantData.forEach((restaurant) => {
      const menuIndex = restaurant.menus.findIndex(
        (menu) => menu.id === menuId
      );

      if (menuIndex !== -1) {
        restaurant.menus.splice(menuIndex, 1);
        menuDeleted = true;
      }
    });

    if (menuDeleted) {
      router.db.set("restaurants", restaurantData).write();
      response.json({ message: "Menu deleted successfully." });
    } else {
      response
        .status(404)
        .json({ error: "Menu not found in any restaurant" });
    }
  });
};
