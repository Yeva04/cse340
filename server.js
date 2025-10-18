// ----------------------
// Load environment + modules
// ----------------------
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();

const app = express();

// ----------------------
// Import controllers & routes
// ----------------------
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities");

// ----------------------
// Core middleware setup
// ----------------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// ----------------------
// Sessions and flash setup (MUST be before routes)
// ----------------------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());

// Global flash variables for all views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.notice = req.flash("notice");
  next();
});

// ----------------------
// View engine setup
// ----------------------
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// ----------------------
// Routes
// ----------------------
app.get("/", baseController.buildHome);
app.use("/inv", inventoryRoute);

// ----------------------
// Static file fix (CSS direct access)
// ----------------------
app.use(express.static("public", { index: false }));
app.get("/css/styles.css", (req, res) => {
  res.sendFile("styles.css", { root: "public/css" });
});

// ----------------------
// Test route to trigger intentional server error
// ----------------------
app.get("/500", (req, res, next) => {
  try {
    throw new Error("Intentional test error for server!");
  } catch (err) {
    next(err); // Pass to the error-handling middleware
  }
});

// ----------------------
// Error handlers
// ----------------------

// Handle thrown errors (middleware next(err))
app.use(async (err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  const nav = await utilities.getNav();
  res.status(500).render("errors/500", {
    title: "Server Error",
    nav,
    message: err.message || "Something went wrong. Please try again later.",
  });
});

// 404 not found
app.use(async (req, res) => {
  const nav = await utilities.getNav();
  res.status(404).render("errors/404", {
    title: "Page Not Found",
    nav,
  });
});

// ----------------------
// Start server
// ----------------------
const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";
app.listen(port, () => console.log(`App listening on ${host}:${port}`));
