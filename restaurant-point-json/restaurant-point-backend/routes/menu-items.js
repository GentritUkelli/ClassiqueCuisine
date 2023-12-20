const jsonServer = require("json-server");
const router = jsonServer.router("db.json");
const { readLastUsedMenuItemsId } = require("../utils");
const server = jsonServer.create();
const middlewares = jsonServer.defaults();
server.use(middlewares);
server.use(jsonServer.bodyParser);

module.exports = function (server) {
  let menuItemIdCounter = readLastUsedMenuItemsId();

  server.post("/api/menus/:rest_id/:menu_id", (request, response) => {
    const restaurantId = parseInt(request.params.rest_id);
    const menusId = parseInt(request.params.men_id);
    const restaurantsData = router.db.get("restaurants").value();
    const restaurant = restaurantsData.find((rest) => rest.id === restaurantId);

    if (!restaurant) {
      response.status(404).json({ error: "Restaurant not found" });
    } else {
      const menus = restaurant.menu_items.find(menu => menu.id === menusId);
      if(!menus){
        response.status(404).json({ error: "Menu not found in the restaurant" });
      }else {
       const requestBody = request.body;
       createMenuItems(restaurant, requestBody, response, restaurantsData);
      }
    }
  });

  function createMenuItems(menu, requestBody, response, restaurantsData) {
    const newMenuItems = {
      id: menuItemIdCounter++,
      name: requestBody.name,
      description: requestBody.description,
      price: parseInt(requestBody.price),
    };

    menu.menuItems_list.push(newMenuItems);

    router.db.set("restaurants", restaurantsData).write();
    const lastUsedId = router.db.get("lastUsedId").value();

    lastUsedId.menuId = menuItemIdCounter;
    router.db.set("lastUsedId", lastUsedId).write();
    response.json(newMenuItems);
  }

  server.get("/api/menuItems/:rest_id/:menu_id/:id?", (request, response) => {
    const restaurantId = parseInt(request.params.restaurant_id);
    const menuId = parseInt(request.params.menu_id);
    const menuItemsId = request.params.id ? parseInt(request.params.id) : null;
  
    const restaurantsData = router.db.get("restaurants").value();
    const restaurant = restaurantsData.find((rest) => rest.id === restaurantId);

    if (!restaurant) {
      response.status(404).json({ error: "Restaurant not found" });
    } else {
      const menu = restaurant.menu_list.find((men) => men.id === menuId);
  
      if (!menu) {
        response.status(404).json({ error: "Menu not found in the restaurant" });
      } else {
        if (menuItemsId) {
          const menuItems = menu.menuItem_list.find((t) => t.id === menuItemsId);
  
          if (!menuItems) {
            response.status(404).json({ error: "Menu Item not found" });
          } else {
            response.json(menuItems);
          }
        } else {
          response.json(menu.menuItem_list);
        }
      }
    }
});

  server.delete("/api/menuItems/:rest_id/:men_id/:menuItems_id", (request, response) => {
    const restaurantId = parseInt(request.params.rest_id);
    const menuId = parseInt(request.params.men_id);
    const menuItemsId = parseInt(request.params.menuItems_id);
    const restaurantsData = router.db.get("restaurants").value();
    const restaurant = restaurantsData.find((rest) => rest.id === restaurantId);
    if (!restaurant) {
      response.status(404).json({ error: "Restaurant not found" });
    } else {
      const menu = restaurant.menu_list.find((men) => men.id === menuId);
      if (!menu) {
        response.status(404).json({ error: "Menu not found in the restaurant" });
      } else {
        const menuItems = menu.menuItems_list.find((t) => t.id === menuItemsId);
        menu.menuItems_list.splice(menuItemsId, 1);
        router.db.set("restaurants", restaurantsData).write();
        response.json({ message: "Menu Item deleted successfully" });
      }
    }
  });

  server.get("/api/menuItems/:menuItems_id", (request, response) => {
    const menuItemsId = parseInt(request.params.menuItems_id);
    const restaurantsData = router.db.get("restaurants").value();
    for (const restaurant of restaurantsData) {
      for (const menu of restaurant.menu_list) {
        const menuItem = menu.menuItem_list.find((menuItems) => menuItems.id === menuItemsId);
        if (menuItem) {
          return response.json(menuItem);
        }
      }
    }
    response.status(404).json({ error: "Menu Item not found" });
  });

  server.put("/api/menuItems/:rest_id/:men_id/:menuItems_id", (request,response ) => {
    const restaurantId = parseInt(request.params.rest_id);
    const menuId = parseInt(request.params.men_id);
    const menuItemsId = parseInt(request.params.menuItems_id);
    const requestBody = request.body;

    console.log("Received PUT request with the following parameters:");
    console.log("Restaurant ID:" , restaurantId);
    console.log("Menu ID:", menuId);
    console.log("Menu Item ID:", menuItemsId);
    console.log("Request Body:", requestBody);

    const restaurantsData = router.db.get("restaurants").value();
    const restaurant = restaurantsData.find((rest) => rest.id === restaurantsData);
    if(!restaurant){
      response.status(404).json({error: "Restaurant not found"});
    } else{
      const menu = restaurant.menu_list.find((men) => men.id === menuId);

      if(!menu){
        response.status(404).json({error: "Menu not found in the restaurant"});
      }else{
        updateMenuItems(menuItemsId, menu, requestBody, response, restaurantsData);
      }
    }
  });

  function updateMenuItems(menuItemsId, menu, updatedData, response, restaurantsData){
    const menuItemsList = menu.menuItems_list;
    const menuItemsIndex = menuItemsList.findIndex((menuItem) => menuItem.id === menuItemsId);

    if(menuItemsIndex === -1){
      response.status(404).json({error: "Menu Item not found"});
    }else {
      menuItemsList[menuItemsIndex] ={...menuItemsList[menuItemsIndex], ...updatedData};

      router.db.set("restaurants" , restaurantsData).write();
      response.json({message: "Menu Item updated successfully"});
    }
  }
};