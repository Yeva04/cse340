const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");

/* ✅ Management page (main /inv route) */
router.get("/", utilities.handleErrors(invController.buildManagement));

/* ✅ Show vehicles by classification */
router.get("/type/:classification_id", utilities.handleErrors(invController.buildByClassificationId));

/* ✅ Vehicle detail view */
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildVehicleDetail));

/* ✅ Add classification */
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification", utilities.handleErrors(invController.addClassification));

/* ✅ Add inventory */
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
router.post("/add-inventory", utilities.handleErrors(invController.addInventory));

module.exports = router;
