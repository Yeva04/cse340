const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const invController = {};

/* ✅ Build management view (the main /inv page) */
invController.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      message: null,
    });
  } catch (err) {
    console.error("Error building management page:", err);
    next(err);
  }
};

/* ✅ Build inventory by classification ID */
invController.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = parseInt(req.params.classification_id);
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data.rows);
    const nav = await utilities.getNav();
    const className = data.rows.length > 0 ? data.rows[0].classification_name : "Vehicles";

    res.render("inventory/classification", {
      title: `${className} Vehicles`,
      nav,
      grid,
    });
  } catch (error) {
    console.error("Error building classification page:", error);
    next(error);
  }
};

/* ✅ Show all inventory (not used for /inv, but for general listing) */
invController.showAllInventory = async function (req, res, next) {
  try {
    const data = await invModel.getAllInventory();
    const grid = await utilities.buildClassificationGrid(data.rows);
    const nav = await utilities.getNav();
    res.render("inventory/classification", {
      title: "All Vehicles",
      nav,
      grid,
    });
  } catch (error) {
    console.error("Error showing all inventory:", error);
    next(error);
  }
};

/* ✅ Build vehicle detail page */
invController.buildVehicleDetail = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    const data = await invModel.getVehicleById(inv_id);

    if (!data.rows || data.rows.length === 0) {
      return res.status(404).render("inventory/detail", {
        title: "Vehicle Not Found",
        nav: await utilities.getNav(),
        data: null,
      });
    }

    const vehicle = data.rows[0];
    const nav = await utilities.getNav();

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      data: vehicle, // ✅ defines “data” for EJS
    });
  } catch (error) {
    console.error("Error building vehicle detail:", error);
    next(error);
  }
};

/* ✅ Build Add Classification page */
invController.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

/* ✅ Add Classification handler */
invController.addClassification = async function (req, res) {
  const { classification_name } = req.body;
  const nav = await utilities.getNav();

  try {
    await invModel.addClassification(classification_name);
    res.redirect("/inv");
  } catch (error) {
    console.error("Error adding classification:", error);
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      message: "Error adding classification. Try again.",
    });
  }
};

/* ✅ Build Add Inventory form */
invController.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    let classificationsResult = await invModel.getClassifications();
    let classifications = classificationsResult.rows;

    res.render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classifications, // ✅ defined here for EJS
      errors: null,
    });
  } catch (err) {
    console.error("Error building Add Inventory page:", err);
    next(err);
  }
};

/* ✅ Add Inventory handler */
invController.addInventory = async function (req, res) {
  const nav = await utilities.getNav();
  const vehicleData = req.body;

  try {
    await invModel.addInventory(vehicleData);
    res.redirect("/inv");
  } catch (error) {
    console.error("Error adding inventory:", error);
    const classificationsResult = await invModel.getClassifications();
    const classifications = classificationsResult.rows;

    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classifications,
      message: "Error adding vehicle. Please try again.",
    });
  }
};

module.exports = invController;
