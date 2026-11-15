import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hotel name is required'],
      trim: true,
      maxlength: [150, 'Hotel name cannot exceed 150 characters'],
    },
    tagline: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Hotel description is required'],
    },
    city: {
      type: String,
      required: [true, 'City / Destination is required'],
      trim: true,
      index: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      default: 'India',
    },
    address: {
      type: String,
      required: [true, 'Street address is required'],
    },
    rating: {
      type: Number,
      default: 4.8,
      min: [1, 'Rating must be at least 1.0'],
      max: [5, 'Rating cannot exceed 5.0'],
      index: true,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      enum: ['Hotel', 'Resort', 'Villa', 'Heritage Palace'],
      default: 'Hotel',
      index: true,
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Starting price per night is required'],
      min: [0, 'Price cannot be negative'],
      index: true,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image URL is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    scores: {
      cleanliness: { type: Number, default: 4.9 },
      location: { type: Number, default: 4.9 },
      service: { type: Number, default: 4.9 },
      amenities: { type: Number, default: 4.8 },
      value: { type: Number, default: 4.8 },
    },
    reviews: [
      {
        author: { type: String, required: true },
        rating: { type: Number, default: 5 },
        date: { type: String, default: 'Recent' },
        avatar: { type: String, default: '' },
        comment: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// Virtual relationship with Room model
hotelSchema.virtual('rooms', {
  ref: 'Room',
  localField: '_id',
  foreignField: 'hotel',
  justOne: false,
});

export const Hotel = mongoose.model('Hotel', hotelSchema);

