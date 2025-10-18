const pool = require("../database/");
const invModel = {};

/* ✅ Get all classifications */
invModel.getClassifications = async function () {
  try {
    const data = await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    );
    console.log("✅ getClassifications executed, rows:", data.rows.length);
    return data;
  } catch (err) {
    console.error("❌ Error in getClassifications:", err);
    throw err;
  }
};

/* ✅ Get inventory by classification_id */
invModel.getInventoryByClassificationId = async function (classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
       JOIN public.classification
       ON inventory.classification_id = classification.classification_id
       WHERE inventory.classification_id = $1`,
      [classification_id]
    );
    return data;
  } catch (err) {
    console.error("❌ Error in getInventoryByClassificationId:", err);
    throw err;
  }
};

/* ✅ Get vehicle details by inv_id */
invModel.getVehicleById = async function (inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
       JOIN public.classification
       ON inventory.classification_id = classification.classification_id
       WHERE inv_id = $1`,
      [inv_id]
    );
    return data;
  } catch (err) {
    console.error("❌ Error in getVehicleById:", err);
    throw err;
  }
};

/* ✅ Add new classification */
invModel.addClassification = async function (classification_name) {
  try {
    const data = await pool.query(
      "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *",
      [classification_name]
    );
    return data;
  } catch (err) {
    console.error("❌ Error in addClassification:", err);
    throw err;
  }
};

/* ✅ Add new inventory */
invModel.addInventory = async function (vehicleData) {
  try {
    const sql = `
      INSERT INTO public.inventory 
      (inv_make, inv_model, inv_year, inv_description, inv_image, 
       inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`;
    const data = await pool.query(sql, [
      vehicleData.inv_make,
      vehicleData.inv_model,
      vehicleData.inv_year,
      vehicleData.inv_description,
      vehicleData.inv_image,
      vehicleData.inv_thumbnail,
      vehicleData.inv_price,
      vehicleData.inv_miles,
      vehicleData.inv_color,
      vehicleData.classification_id,
    ]);
    return data;
  } catch (err) {
    console.error("❌ Error in addInventory:", err);
    throw err;
  }
};

/* ✅ Get all inventory */
invModel.getAllInventory = async function () {
  try {
    const result = await pool.query(
      "SELECT * FROM public.inventory ORDER BY inv_id"
    );
    return result;
  } catch (error) {
    console.error("❌ Error in getAllInventory:", error);
    throw error;
  }
};

module.exports = invModel;
