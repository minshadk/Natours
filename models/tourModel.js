const mongoose = require("mongoose");

// Specifing schema for databases

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // Validiater
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true
    },

    duration: {
      type: Number,
      required: [true, "A tour must have a durations"]
    },

    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a Maximum group size"]
    },

    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"]
    },

    ratingsAverage: {
      type: Number,
      default: 0
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },

    price: {
      type: Number,
      required: [true, "A tour must have a price"]
    },

    priceDiscount: Number,

    summary: {
      type: String,
      // Trim remove all the whitespace in the beging and the end
      trim: true,
      required: [true, "A tour must have a summary"]
    },

    description: {
      type: String,
      trim: true
    },

    imageCover: {
      // Refrence of image in the file systeam
      type: String,
      required: [true, "A tour must have a image cover"]
    },

    images: [String],

    createdAt: {
      type: Date,
      default: Date.now(),
      // hiding the created at from the user
      select: false
    },

    startDates: [Date]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//Creating instance of  model
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
