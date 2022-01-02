const express = require("express");

const tourRouter = require("./routes/tourRouter");

const app = express();

// MIDDLEWARES

// used for accessing ?? must have for accesing data from body
app.use(express.json());

// ROUTES
app.use("/api/v1/tours", tourRouter);

module.exports = app;
