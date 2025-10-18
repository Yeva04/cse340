const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Build the full navigation HTML
 ************************** */
Util.getNav = async function () {
  try {
    const data = await invModel.getClassifications();
    let nav = "<ul id='nav'>";
    nav += '<li><a href="/" title="Home page">Home</a></li>';

    if (data.rows && data.rows.length > 0) {
      data.rows.forEach((row) => {
        nav += `<li><a href="/inv/type/${row.classification_id}" 
          title="See our ${row.classification_name} inventory">
          ${row.classification_name}</a></li>`;
      });
    } else {
      nav += "<li>No classifications available</li>";
    }

    nav += "</ul>";
    return nav;
  } catch (error) {
    console.error("❌ getNav error:", error);
    return "<ul><li>Error loading navigation</li></ul>";
  }
};

/* **************************************
 * Build classification grid HTML
 ************************************** */
Util.buildClassificationGrid = async function (data) {
  if (!data || data.length === 0) {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  let grid = '<ul id="inv-display">';
  data.forEach(vehicle => {
    grid += `<li>
      <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
        <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
      </a>
      <div class="namePrice">
        <hr />
        <h2>
          <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            ${vehicle.inv_make} ${vehicle.inv_model}
          </a>
        </h2>
        <span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>
      </div>
    </li>`;
  });
  grid += "</ul>";
  return grid;
};

/* ***************************
 * Build vehicle detail HTML
 *************************** */
Util.buildVehicleDetail = function (vehicle) {
  if (!vehicle) {
    return "<p class='notice'>Vehicle not found.</p>";
  }

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(vehicle.inv_price);

  const formattedMiles = new Intl.NumberFormat("en-US").format(vehicle.inv_miles || 0);

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

/* ****************************************
 * Build dropdown list of classifications
 **************************************** */
Util.buildClassificationList = async function (selectedId = null) {
  try {
    const data = await invModel.getClassifications();
    let classificationList = '<select name="classification_id" id="classificationList" required>';
    classificationList += '<option value="">Choose a Classification</option>';

    data.rows.forEach((row) => {
      classificationList += `
        <option value="${row.classification_id}" 
          ${selectedId == row.classification_id ? "selected" : ""}>
          ${row.classification_name}
        </option>`;
    });

    classificationList += "</select>";
    return classificationList;
  } catch (error) {
    console.error("❌ buildClassificationList error:", error);
    return '<select name="classification_id" id="classificationList"><option value="">Error Loading Classifications</option></select>';
  }
};

/* ✅ Async error handler wrapper */
Util.handleErrors = (fn) => {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = Util;
