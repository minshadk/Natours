const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

// Specifing schema for databases

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // Validiater
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less or equal to 40 characters"],
      minlength: [5, "A tour name must have less or equal to 40 characters"],
      // using validator form validater libary
      // validate: [validator.isAlpha, 'Tour name must only contain charachters']
    },

    slug: String,

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
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty must easy,medium or difficult"
      }
    },

    ratingsAverage: {
      type: Number,
      default: 0,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"]
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },

    price: {
      type: Number,
      required: [true, "A tour must have a price"]
    },

    priceDiscount: {
      type: Number,
      // ___________________________ Custom validater
      validate: {
        type:Number,
        validator: function (val) {
          // this only points to current doc on New doucument creation
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below reqular price"
      }
    },

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

    startDates: [Date],

    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre("save", function (next) {
  // this is currently prossed document
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre("save", function (next) {
//   console.log("Will save document");
//   next();
// });

// // have accsses to next and doucment just saved
// tourSchema.post("save", function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// tourSchema.pre("find", function (next) {
// Function will exicute for all the string that start with find
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  console.log(this.pipeline());
  next();
});

//Creating instance of  model
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
