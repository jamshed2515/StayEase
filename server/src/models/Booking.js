import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
      index: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
      index: true,
    },
    // Denormalized snapshot data to preserve reservation details if room/hotel changes later
    hotelName: { type: String, required: true },
    hotelImage: { type: String, default: '' },
    city: { type: String, default: '' },
    country: { type: String, default: '' },
    roomName: { type: String, required: true },

    guestName: { type: String, required: true, trim: true },
    guestEmail: { type: String, required: true, trim: true },
    guestPhone: { type: String, default: '' },

    checkIn: { type: Date, required: true, index: true },
    checkOut: { type: Date, required: true, index: true },
    nights: { type: Number, required: true, min: 1 },
    guests: { type: Number, required: true, default: 2, min: 1 },

    pricePerNight: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    taxesAndFees: { type: Number, required: true },
    finalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: ['Confirmed', 'Completed', 'Cancelled'],
      default: 'Confirmed',
      index: true,
    },
    paymentMethod: {
      type: String,
      default: 'Credit Card •••• 4242',
    },
    specialRequests: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        // Format checkIn and checkOut as YYYY-MM-DD for frontend compatibility
        if (ret.checkIn) ret.checkIn = ret.checkIn.toISOString().split('T')[0];
        if (ret.checkOut) ret.checkOut = ret.checkOut.toISOString().split('T')[0];
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Helper static to generate unique booking number like BK-7284
bookingSchema.statics.generateBookingNumber = function () {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `BK-${randomDigits}`;
};

export const Booking = mongoose.model('Booking', bookingSchema);

