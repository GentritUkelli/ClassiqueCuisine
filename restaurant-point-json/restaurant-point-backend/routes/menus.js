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
      const menuList = restaurant.menus; 
      if (requestBody.id === undefined) {
        let menuId;
        menuId = menuIdCounter++;
        const newMenu = {
          id: menuId,
          name: requestBody.name,
          menu_items: [], 
        };
        menuList.push(newMenu);
        restaurant.menus = menuList; 
        router.db.set("restaurants", restaurantsData).write();
        const lastUsedId = router.db.get("lastUsedId").value();
        lastUsedId.menuId = menuIdCounter;
        router.db.set("lastUsedId", lastUsedId).write();
        response.json(restaurantsData[index]);
      } else {
        const menusIndex = menuList.findIndex(
          (menus) => menus.id === parseInt(requestBody.id)
        );
        if (menusIndex === -1) {
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
          menuList[menusIndex] = {
            ...menuList[menusIndex],
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
      const menu = restaurant.menus.find((men) => men.id === menuId);
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
    for (const restaurant of restaurantsData) {
      const menu = restaurant.menus.find((menu) => menu.id === menuId);
      if (menu) {
          // Remove the menu from the restaurant's menu_list
          const menuIndex = restaurant.menus.indexOf(menu);
          restaurant.menus.splice(menuIndex, 1);
          menuDeleted = true;
          break; // Exit the loop once the menu is found and deleted
      }
  }

  if (menuDeleted) {
      // Save the updated data
      router.db.set("restaurants", restaurantsData).write();
      response.json({ message: "Menu deleted successfully" });
  } else {
      response.status(404).json({ error: "Menu not found in any restaurant" });
  }
});
};
