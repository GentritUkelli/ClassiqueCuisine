const jsonServer = require("json-server");

const router = jsonServer.router("db.json");

function readLastUsedRestaurantsId() {
    try {
        const data = router.db.get("lastUsedId").value();
        return data.restaurantsId;
    } catch (error) {
        return 1;
    }
}

function writeLastUsedRestaurantsId(value) {
    const lastUsedId = router.db.get("lastUsedId").value();
    lastUsedId.RestaurantsId = value;
    router.db.set("lastUsedId", lastUsedId).write();
}

function readLastUsedMenusID() {
    try {
        const data = router.db.get("lastUsedId").value();
        return data.menusId;
    } catch (error) {
        return 1;
    }
}

function writeLastUsedMenusId(value) {
    const lastUsedId = router.db.get("lastUsedId").value();
    lastUsedId.menusId = value;
    router.db.set("lastUsedId", lastUsedId).write();
}

function readLastUsedMenuItemsID() {
    try {
        const data = router.db.get("lastUsedId").value();
        return data.menuitemsId;
    } catch (error) {
        return 1;
    }
}

function writeLastUsedMenuItemsId(value) {
    const lastUsedId = router.db.get("lastUsedId").value();
    lastUsedId.menuitemsId = value;
    router.db.set("lastUsedId", lastUsedId).write();
}

module.exports = {
    readLastUsedRestaurantsId,
    writeLastUsedRestaurantsId,
    readLastUsedMenusID,
    writeLastUsedMenusId,
    readLastUsedMenuItemsID,
    writeLastUsedMenuItemsId
};