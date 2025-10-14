const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};
console.log("invController loaded");

invCont.buildByClassificationId = async function (req, res, next) {
  console.log("buildByClassificationId called");
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data.length > 0 ? data[0].classification_name : "Unknown";
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    const data = await invModel.getInventoryById(inv_id);
    const vehicle = Array.isArray(data) ? data[0] : data; // ensure single record
    console.log("getInventoryById vehicle:", vehicle);
    const detailHtml = await utilities.buildVehicleDetail(vehicle);
    const nav = await utilities.getNav();
    const title = vehicle
      ? `${vehicle.inv_make} ${vehicle.inv_model}`
      : "Vehicle Details";
   res.render("inventory/detail", { title, nav, detailHtml, errors: null });
  } catch (error) {
    console.error("buildByInventoryId error:", error);
    next(error);
  }
};

invCont.buildDeleteConfirmation = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    const vehicle = await invModel.getInventoryById(inv_id);
    const nav = await utilities.getNav();
    res.render("inventory/delete", {
      title: "Delete Vehicle",
      nav,
      inv_id,
      vehicle,
    });
  } catch (error) {
    console.error("buildDeleteConfirmation error:", error);
    next(error);
  }
};

invCont.triggerError = function (req, res, next) {
  throw new Error("Intentional 500 Error for Testing");
};


// Deliver management view
invCont.buildManagement = async function (req, res, next) {
  try {
    const messages = req.flash("notice")
    res.render("inventory/management", {
      title: "Inventory Management",
      messages,
    })
  } catch (error) {
    console.error("Management view error:", error)
    next(error)
  }
}


module.exports = invCont;