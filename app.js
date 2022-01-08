const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// MIDDLEWARES

// used for accessing ?? must have for accesing data from body
app.use(express.json());

// ROUTES
app.use("/api/v1/tours", tourRouter);
// app.use("/api/v1/users", userRouter);

// All the http request
// app.all("*", (req, res, next) => {
//   res.status(404).json({
//     status: "fail",
//     message: `Can't find ${req.originalUrl} on   this server`
//   });

// const err = new Error(`Can't find ${req.originalUrl} on   this server`);
// err.status = "fail";
// err.statusCode = 404;
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on   this server !`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
