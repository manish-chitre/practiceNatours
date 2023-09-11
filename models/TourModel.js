const slugify = require("slugify");
const mongoose = require("mongoose");
const User = require("./UserModel");

const tourSchema = mongoose.Schema(
  {
    id: {
      type: Number,
    },
    name: {
      type: String,
      unique: true,
      required: [true, "name is required"],
      minLength: [4, "min length can be from 4 characters"],
      maxLength: [40, "max length can be 40 characters"],
    },
    slug: String,
    difficulty: {
      type: String,
      enum: {
        values: ["difficult", "medium", "easy"],
        message: "difficulty can be difficult, medium or easy",
      },
    },
    duration: {
      type: String,
      required: [true, "duration is required"],
    },
    maxGroupSize: {
      type: Number,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [0, "ratings can start from 0"],
      max: [5, "ratings can be till 5"],
      set: (val) => Math.round(val * 10) / 10, //4.666666 => 46.66666 => 4.7
    },
    ratingsQuantity: {
      type: Number,
    },
    price: {
      type: Number,
      required: [true, "a tour must have price"],
    },
    summary: {
      type: String,
    },
    description: {
      type: String,
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    imageCover: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    startDates: [
      {
        type: Date,
      },
    ],
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    skipInvalid: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//tourSchema.index({ price: 1 }); //1 ascending order -1 decending order

tourSchema.index({ price: 1, ratingsAverage: -1 });

tourSchema.virtual("durationWeeks").get(function () {
  let duration = this.duration / 7;
  duration = parseFloat(duration.toFixed(2));
  return duration;
});

tourSchema.virtual("reviews", {
  ref: "reviews",
  foreignField: "tour",
  localField: "_id",
});

//Embedding Documents
// tourSchema.pre("save", async function (next) {
//   const guidesPromises = this.guides.map(async (id) => User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   console.log(this.guides);
//   next();
// });

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
  next();
});

//document middle ware
// tourSchema.pre("save", function (next) {
//   this.slug = slugify(this.name, {lower: true});
//   next();
// });

// tourSchema.pre("save", function (next) {
//   console.log("this will save the document..");
//   next();
// });

// tourSchema.post("save", function (doc, next) {
//   console.log(doc);
//   next();
// });

//query middleware
// tourSchema.pre(/^find/, function (next) {
//   this.find({duration: "9"});
//   this.start = Date.now();
//   next();
// });

// tourSchema.post(/^find/, function (doc, next) {
//   console.log(`Query took ${Date.now() - this.start} millisecounds`);
//   console.log(doc);
//   next();
// });

// tourSchema.pre("aggregate", function (next) {
//   this.pipeline().unshift({$match: {secretTour: {$ne: true}}});
//   console.log(this.pipeline());
//   next();
// });

const Tour = mongoose.model("Tours", tourSchema);

module.exports = Tour;
