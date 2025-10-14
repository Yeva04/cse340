const pool = require("../database/index.js");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  // An asynchronous function returns a promise, without blocking the execution of the code.
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

/* ***************************
 *  Get inventory by classification ID
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error);
    throw error; // Re-throw to handle in controller
  }
}


async function getInventoryById(inv_id) {
  try {
    const sql = `
      SELECT * FROM public.inventory 
      WHERE inv_id = $1
    `;
    const data = await pool.query(sql, [inv_id]);
    console.log("Query result:", data.rows);
    return data.rows[0]; // Return the first row (should be only one)
  } catch (error) {
    console.error("getInventoryById error " + error);
    throw error;
  }
}

module.exports = { getClassifications, getInventoryByClassificationId, getInventoryById };