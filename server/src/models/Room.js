import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: [true, 'Room must be assigned to a hotel'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Room name / suite type is required'],
      trim: true,
    },
    bedType: {
      type: String,
      default: '1 King Bed',
    },
    capacity: {
      type: Number,
      required: [true, 'Guest capacity is required'],
      default: 2,
      min: [1, 'Capacity must be at least 1 guest'],
    },
    size: {
      type: String,
      default: '50 m²',
    },
    price: {
      type: Number,
      required: [true, 'Nightly room rate is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    },
    features: {
      type: [String],
      default: ['Complimentary High-Speed Wi-Fi', 'Artisan Breakfast Included'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Room = mongoose.model('Room', roomSchema);

