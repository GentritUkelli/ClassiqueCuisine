const jsonServer = require("json-server");
const router = jsonServer.router("db.json");
const { readLastUsedMenusId } = require("../utils");
const server = jsonServer.create();
const middlewares = jsonServer.defaults();
server.use(middlewares);
server.use(jsonServer.bodyParser);

module.exports = function (server) {
  let menuIdCounter = readLastUsedMenusId();

  server.post("/api/menus/:restaurant_id", (request, response) => {
    const restaurantId = parseInt(request.params.restaurant_id);
    const restaurantsData = router.db.get("restaurants").value();
    const restaurant = restaurantsData.find((rest) => rest.id === restaurantId);

    if (!restaurant) {
      response.status(404).json({ error: "Restaurant not found" });
    } else {
      const requestBody = request.body;
      createMenu(restaurant, requestBody, response, restaurantsData);
    }
  });

  function createMenu(restaurant, requestBody, response, restaurantsData) {
    const newMenu = {
      id: menuIdCounter++,
      name: requestBody.name,
      menu_items: [],
    };

    restaurant.menus.push(newMenu);

    router.db.set("restaurants", restaurantsData).write();
    const lastUsedId = router.db.get("lastUsedId").value();

    lastUsedId.menuId = menuIdCounter;
    router.db.set("lastUsedId", lastUsedId).write();
    response.json(newMenu);
  }

  server.get("/api/menus/:restaurant_id/:menu_id?", (request, response) => {
    const restaurantId = parseInt(request.params.restaurant_id);
    const menuId = request.params.menu_id ? parseInt(request.params.menu_id) : null;

    const restaurantsData = router.db.get("restaurants").value();
    const restaurant = restaurantsData.find((rest) => rest.id === restaurantId);

    if (!restaurant) {
      response.status(404).json({ error: "Restaurant not found" });
    } else {
      if (menuId) {
        const menu = restaurant.menus.find((m) => m.id === menuId);

        if (!menu) {
          response.status(404).json({ error: "Menu not found" });
        } else {
          response.json(menu);
        }
      } else {
        response.json(restaurant.menus);
      }
    }
  });

  server.delete("/api/menus/:restaurant_id/:menu_id", (request, response) => {
    const restaurantId = parseInt(request.params.restaurant_id);
    const menuId = parseInt(request.params.menu_id);
    const restaurantsData = router.db.get("restaurants").value();
    const restaurant = restaurantsData.find((rest) => rest.id === restaurantId);

    if (!restaurant) {
      response.status(404).json({ error: "Restaurant not found" });
    } else {
      const menuIndex = restaurant.menus.findIndex((m) => m.id === menuId);

      if (menuIndex === -1) {
        response.status(404).json({ error: "Menu not found" });
      } else {
        restaurant.menus.splice(menuIndex, 1);
        router.db.set("restaurants", restaurantsData).write();
        response.json({ message: "Menu deleted successfully" });
      }
    }
  });

  server.put("/api/menus/:restaurant_id/:menu_id", (request, response) => {
    const restaurantId = parseInt(request.params.restaurant_id);
    const menuId = parseInt(request.params.menu_id);
    const requestBody = request.body;

    const restaurantsData = router.db.get("restaurants").value();
    const restaurant = restaurantsData.find((rest) => rest.id === restaurantId);

    if (!restaurant) {
      response.status(404).json({ error: "Restaurant not found" });
    } else {
      updateMenu(menuId, restaurant, requestBody, response, restaurantsData);
    }
  });

  function updateMenu(menuId, restaurant, updatedData, response, restaurantsData) {
    const menuList = restaurant.menus;
    const menuIndex = menuList.findIndex((menu) => menu.id === menuId);

    if (menuIndex === -1) {
      response.status(404).json({ error: "Menu not found" });
    } else {
      menuList[menuIndex] = { ...menuList[menuIndex], ...updatedData };

      router.db.set("restaurants", restaurantsData).write();
      response.json({ message: "Menu updated successfully" });
    }
  }
};
