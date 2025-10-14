const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv").config();
const app = express();

const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/");

// View engine setup
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Static files
app.use(express.static("public", { index: false }));
app.get("/css/styles.css", (req, res) => {
  res.sendFile("styles.css", { root: "public/css" });
});

// Routes
app.get("/", baseController.buildHome);
app.use("/inv", inventoryRoute);
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err)
  res.status(500).send("Internal Server Error: " + err.message)
})


// 500 error handler
app.use(async (err, req, res, next) => {
  console.error(err);
  const nav = await utilities.getNav();
  res.status(500).render("errors/error", {
    title: "Server Error",
    nav,
    message: "Something went wrong. Please try again later.",
  });
});

// 404 error handler
app.use(async (req, res) => {
  const nav = await utilities.getNav();
  res.status(404).render("errors/404", {
    title: "Page Not Found",
    nav,
  });
});

// Server info
const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";
app.listen(port, () => console.log(`App listening on ${host}:${port}`));
