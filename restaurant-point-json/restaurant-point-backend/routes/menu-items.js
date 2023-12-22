module.exports = function (server) {
  // Import necessary functions and data
  const { readLastUsedMenuItemsId } = require("../utils"); // Update to match your utility function for menu item IDs
  let menuItemIdCounter = readLastUsedMenuItemsId();
  const jsonServer = require("json-server");
  const router = jsonServer.router("db.json");
  
  server.post("/api/menuItems/:rest_id/:menu_id", (request, response) => {
    const restaurantId = parseInt(request.params.rest_id);
    console.log(restaurantId);
    const menuId = parseInt(request.params.menu_id);
    console.log(menuId)
    const restaurantsData = router.db.get("restaurants").value();
    const restaurant = restaurantsData.find((restaurant) => restaurant.id === restaurantId);
    if (!restaurant) {
      console(restaurant)
      response.status(404).json({ error: "Restaurant not found" });
    } else {
      const menu = restaurant.menus.find((menu) => menu.id === menuId);
      console.log(menu)
      if (!menu) {
        response.status(404).json({ error: "Menu not found in the restaurant" });
      } else {
        const menuItemId = parseInt(request.body.id); // Extract menu item ID from the request
        if (menuItemId) {
          // If the request contains a menu item ID, update the existing menu item
          updateMenuItem(menu, menuItemId, request.body, response, restaurantsData);
        } else {
          // If no menu item ID provided, create a new menu item using POST
          createMenuItem(menu, request.body, response, restaurantsData);
        }
      }
    }
  });
  // Function to update an existing menu item
  function updateMenuItem(menu, menuItemId, requestBody, response, restaurantsData) {
    // Find the index of the menu item in the menu's item list
    const menuItemIndex = menu.menuItems.findIndex(item => item.id === menuItemId);
    if (menuItemIndex === -1) {
      response.status(404).json({ error: "Menu item not found in the menu" });
    } else {
      // Update the existing menu item with the new data
      menu.menuItems[menuItemIndex] = {
        id: menuItemId,
        name: requestBody.name,
        price: parseFloat(requestBody.price),
      };
      router.db.set("restaurants", restaurantsData).write();
      response.json(menu.menuItems[menuItemIndex]);
    }
  }
  // Function to create a new menu item
  function createMenuItem(menu, requestBody, response, restaurantsData) {
    if(!menu.menuItems){
      menu.menuItems = [];
    }
    // Generate a new menu item
    const newMenuItem = {
      id: menuItemIdCounter++, // Assuming menuItemIdCounter is defined elsewhere
      name: requestBody.name,
      price: parseFloat(requestBody.price),
    };
    // Add the new menu item to the menu's item list
    menu.menuItems.push(newMenuItem);

    router.db.set("restaurants", restaurantsData).write();
    
    const lastUsedId = router.db.get("lastUsedId").value();
    lastUsedId.menuItemId = menuItemIdCounter;
    router.db.set("lastUsedId", lastUsedId).write();
    response.json(newMenuItem);
  }
  server.get("/api/menuItems/:rest_id/:menu_id/:id", (request, response) => {
    console.log("menuitems");
    const restaurantId = parseInt(request.params.rest_id);
    const menuId = parseInt(request.params.menu_id);
    const menuItemId = request.params.id ? parseInt(request.params.id) : null; // Menu Item ID (if provided)
    const restaurantsData = router.db.get("restaurants").value();
    const restaurant = restaurantsData.find((restaurant) => restaurant.id === restaurantId);
    if (!restaurant) {
      response.status(404).json({ error: "Restaurant not found" });
    } else {
      const menu = restaurant.menus.find((menu) => menu.id === menuId);
      if (!menu) {
        response.status(404).json({ error: "Menu not found in the restaurant" });
      } else {
        if (menuItemId) {
          // Handle the case where 'id' is provided to fetch a specific menu item
          const menuItem = menu.menuItems.find((item) => item.id === menuItemId);
          if (!menuItem) {
            response.status(404).json({ error: "Menu Item not found" });
          } else {
            response.json(menuItem);
          }
        } else {
          // Handle the case where 'id' is not provided to fetch all menu items for the menu
          response.json(menu.menuItems);
        }
      }
    }
  });
  server.get("/api/menuItems/:rest_id/:menu_id/:id", (request, response) => {
    console.log("menuitems");
    const restaurantId = parseInt(request.params.rest_id);
    const menuId = parseInt(request.params.menu_id);
    const menuItemId = request.params.id ? parseInt(request.params.id) : null; // Menu Item ID (if provided)
    const restaurantsData = router.db.get("restaurants").value();
    const restaurant = restaurantsData.find((restaurant) => restaurant.id === restaurantId);
    if (!restaurant) {
      response.status(404).json({ error: "Restaurant not found" });
    } else {
      const menu = restaurant.menus.find((menu) => menu.id === menuId);
      if (!menu) {
        response.status(404).json({ error: "Menu not found in the restaurant" });
      } else {
        if (menuItemId) {
          // Handle the case where 'id' is provided to fetch a specific menu item
          const menuItem = menu.menuItems.find((item) => item.id === menuItemId);
          if (!menuItem) {
            response.status(404).json({ error: "Menu Item not found" });
          } else {
            response.json(menuItem);
          }
        } else {
          // Handle the case where 'id' is not provided to fetch all menu items for the menu
          response.json(menu.menuItems);
        }
      }
    }
  });
  server.delete("/api/menuItems/:rest_id/:menu_id/:menu_item_id", (request, response) => {
    const restaurantId = parseInt(request.params.rest_id);
    const menuId = parseInt(request.params.menu_id);
    const menu_item_id = parseInt(request.params.menu_item_id);
    const restaurantsData = router.db.get("restaurants").value();
    const restaurant = restaurantsData.find((restaurant) => restaurant.id === restaurantId);
    if (!restaurant) {
      response.status(404).json({ error: "Restaurant not found" });
    } else {
      const menu = restaurant.menus.find((menu) => menu.id === menuId);
      if (!menu) {
        response.status(404).json({ error: "Menu not found in the restaurant" });
      } else {
        const menuItemIndex = menu.menuItems.findIndex((item) => item.id === menu_item_id);
        if (menuItemIndex === -1) {
          response.status(404).json({ error: "Menu Item not found" });
        } else {
          menu.menuItems.splice(menuItemIndex, 1);
          router.db.set("restaurants", restaurantsData).write();
        }
      }
    }
  });
server.get("/api/menuItems/:rest_id/:menu_id", (request, response) => {
  const restaurantId = parseInt(request.params.rest_id);
  const menuId = parseInt(request.params.menu_id);
  const restaurantsData = router.db.get("restaurants").value();
  const restaurant = restaurantsData.find((restaurant) => restaurant.id === restaurantId);
  if (!restaurant) {
    response.status(404).json({ error: "Restaurant not found" });
  } else {
    const menu = restaurant.menus.find((menu) => menu.id === menuId);
    if (!menu) {
      response.status(404).json({ error: "Menu not found in the restaurant" });
    } else {
      const menuItemList = menu.menuItems;
    response.json(menuItemList);
    }
  }
});
};