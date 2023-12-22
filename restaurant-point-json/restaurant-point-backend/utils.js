const jsonServer = require("json-server");

const router = jsonServer.router("db.json");

function readLastUsedRestaurantsId() {
    try {
        const data = router.db.get("lastUsedId").value();
        return data.restaurantId;
    } catch (error) {
        return 1;
    }
}

function writeLastUsedRestaurantsId(value) {
    const lastUsedId = router.db.get("lastUsedId").value();
    lastUsedId.restaurantId = value; // Corrected case here
    router.db.set("lastUsedId", lastUsedId).write();
}

function readLastUsedMenusId() {
    try {
        const data = router.db.get("lastUsedId").value();
        return data.menuId;
    } catch (error) {
        return 1;
    }
}

function writeLastUsedMenusId(value) {
    const lastUsedId = router.db.get("lastUsedId").value();
    lastUsedId.menuId = value;
    router.db.set("lastUsedId", lastUsedId).write();
}

function readLastUsedMenuItemsId() {
    try {
        const data = router.db.get("lastUsedId").value();
        return data.menuItemsId;
    } catch (error) {
        return 1;
    }
}

function writeLastUsedMenuItemsId(value) {
    const lastUsedId = router.db.get("lastUsedId").value();
    lastUsedId.menuItemsId = value;
    router.db.set("lastUsedId", lastUsedId).write();
}

module.exports = {
    readLastUsedRestaurantsId,
    writeLastUsedRestaurantsId,
    readLastUsedMenusId,
    writeLastUsedMenusId,
    readLastUsedMenuItemsId,
    writeLastUsedMenuItemsId
};