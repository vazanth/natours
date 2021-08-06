const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Tour must have a Name'],
      trim: true,
      unique: true,
      maxlength: [
        40,
        'A Tour Name should be less than or equal to 40 characters',
      ],
      minlength: [
        10,
        'A Tour Name should be greater than or equal to 40 characters',
      ],
      // validate: [validator.isAlpha, 'A Tour Name should only have alphabets'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A Tour must have a Duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A Tour must have a Max Group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A Tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty can be either easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.0,
      min: [1, 'Rating Should be greater than 1'],
      max: [5, 'Rating Should be lesser than 5'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A Tour must have a Price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //only works on SAVE or CREATE!!! wont work on update
          return val < this.price;
        },
        message: 'Discount Price ({VALUE}) should be less than price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A Tour must have a Summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A Tour must have a Cover Image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // will not come in response
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: {
          values: ['Point'],
          message: 'Only point is allowed for start location',
        },
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    //embeded doocument
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: {
            values: ['Point'],
            message: 'Only point is allowed for start location',
          },
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // guide: Array, embedding object.
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true }, //to display virtual data
    toObject: { virtuals: true }, //to display virtual data
  },
);

// tourSchema.index({ price: 1 }); //creating index for price field in mongodb
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ startLocation: '2dsphere' }); //index for geospatial
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//virtual populate an alternative to child referencing since data not persisted
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

//Document Middleware : Runs before Save() or Create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//for embedding document by passing id in req and create embedded document with all user info
// tourSchema.pre('save', async function (next) {
//   const guidePromise = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidePromise);
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log('will save document' + doc);
//   next();
// });

//Query Middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.pre(/^find/, function (next) {
  //populate will create a new query,so better avoid with lots of data
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

// tourSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   next();
// });

//Aggregate Middleware
tourSchema.pre('aggregate', function (next) {
  // eslint-disable-next-line no-prototype-builtins
  const isGeo = this.pipeline().find((data) => data.hasOwnProperty('$geoNear'));
  console.log('isGeo', isGeo);
  if (!isGeo) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  }
  console.log(this.pipeline());
  next();
});

module.exports = mongoose.model('Tour', tourSchema);
