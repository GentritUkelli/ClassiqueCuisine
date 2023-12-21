const { request, response } = require("express");
module.exports = function (server) {
  const { readLastUsedMenusId } = require("../utils");
  const jsonServer = require("json-server");
  const router = jsonServer.router("db.json");
  let menuIdCounter = readLastUsedMenusId();

  server.post("/api/menus/:id", (request, response) => {
    const restaurantId = parseInt(request.params.id);
    const requestBody = request.body;
    const restaurantsData = router.db.get("restaurants").value();
    const index = restaurantsData.findIndex((rest) => rest.id === restaurantId);

    // check if the restaurant exists
    if (index === -1) {
      response.status(404).json({ error: "Restaurant not found" });
    } else {
      const restaurant = restaurantsData[index];
      const menuList = restaurant.menu_list;

      if (requestBody.id === undefined) {
        let menuId;
        menuId = menuIdCounter++;
        const newMenu = {
          id: menuId,
          name: requestBody.name,
          menuItems_list: [],
        };
        menuList.push(newMenu);
        restaurant.menu_list = menuList;
        router.db.set("restaurants", restaurantsData).write();
        const lastUsedId = router.db.get("lastUsedId").value();
        lastUsedId.menuId = menuIdCounter;
        router.db.set("lastUsedId", lastUsedId).write();
        response.json(restaurantsData[index]);
      } else {
        const menusIndex = restaurant.menu_list.findIndex(
          (menus) => menus.id === parseInt(requestBody.id)
        );
        if (menusIndex === -1) {
          response
            .status(404)
            .json({ error: "Menu not found in this restaurant" });
        } else {
          requestBody.id = parseInt(requestBody.id);
          const updatedMenu = {
            id: menuId,
          name: requestBody.name,
          menuItems_list: [],
          };
          restaurant.menu_list[menusIndex] = {
            ...restaurant.menu_list[menusIndex],
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
      const menuList = restaurant.menu_list;
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
      const menu = restaurant.menu_list.find(
        (men) => men.id === menuId
      );
      if (!menu) {
        response
          .status(404)
          .json({ error: "Menu not found in this Restaurant" });
      } else {
        response.json(menu);
      }
    }
  });

  server.delete("/api/menus/delete/:id", (request, response) => {
    const menuId = parseInt(request.params.id);
    const restaurantsData = router.db.get("restaurants").value();
    let menuDeleted = false;
    restaurantsData.forEach((restaurant) => {
      const menuIndex = restaurant.menu_list.findIndex(
        (menu) => menu.id === menuId
      );
      if (menuIndex !== -1) {
        restaurant.menu_list.splice(menuIndex, 1);
        menuDeleted = true;
      }
    });
    if (menuDeleted) {
      router.db.set("restaurant", restaurantsData).write();
      response.json({ message: "Menu deleted successfully." });
    } else {
      response
        .status(404)
        .json({ error: "Menu not found in any restaurant" });
    }
  });
};
