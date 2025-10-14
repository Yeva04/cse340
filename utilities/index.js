const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav data array
 ************************** */
Util.getNav = async function (req, res, next) {
  try {
    const data = await invModel.getClassifications();
    if (!data || !Array.isArray(data.rows) || data.rows.length === 0) {
      console.warn("⚠️ Database returned no classifications. Using fallback nav.");
      return [
        { classification_id: 0, classification_name: "Home" },
        { classification_id: 1, classification_name: "Inventory" },
        { classification_id: 2, classification_name: "About" },
        { classification_id: 3, classification_name: "Contact" }
      ];
    }
    return data.rows;
  } catch (error) {
    console.error("❌ getNav DB error: " + error.message);
    // Safe fallback nav for when DB fails
    return [
      { classification_id: 0, classification_name: "Home" },
      { classification_id: 1, classification_name: "Inventory" },
      { classification_id: 2, classification_name: "About" },
      { classification_id: 3, classification_name: "Contact" }
    ];
  }
};

/* **************************************
 * Build the classification view HTML
 ************************************** */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data && data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach(vehicle => {
      grid += `<li>
        <a href="/inv/detail/${vehicle.inv_id}" 
           title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
           <img src="${vehicle.inv_thumbnail}" 
                alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
        </a>
        <div class="namePrice">
          <hr />
          <h2>
            <a href="/inv/detail/${vehicle.inv_id}" 
               title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
               ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>
        </div>
      </li>`;
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* ***************************
 * Build vehicle detail HTML
 *************************** */
Util.buildVehicleDetail = function (vehicle) {
  if (!vehicle) {
    return "<p class='notice'>Vehicle not found.</p>";
  }

  const formattedPrice = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(vehicle.inv_price);
  const formattedMiles = new Intl.NumberFormat("en-US").format(vehicle.inv_miles);

  return `
    <div class="vehicle-detail">
      <div class="detail-image">
        <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />
      </div>
      <div class="detail-content">
        <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <p><strong>Year:</strong> ${vehicle.inv_year}</p>
        <p><strong>Price:</strong> ${formattedPrice}</p>
        <p><strong>Mileage:</strong> ${formattedMiles} miles</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
      </div>
    </div>
  `;
};

module.exports = Util;
