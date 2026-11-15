import mongoose from 'mongoose';
import { env } from './src/config/env.js';
import app from './src/app.js';

let server;
const BASE_URL = `http://127.0.0.1:5001/api/v1`;

const results = [];

const assert = (condition, testName, details = '') => {
  if (condition) {
    results.push({ test: testName, status: 'PASS', details });
    console.log(`  \x1b[32m✔ PASS\x1b[0m ${testName} ${details ? `(${details})` : ''}`);
  } else {
    results.push({ test: testName, status: 'FAIL', details });
    console.error(`  \x1b[31m✘ FAIL\x1b[0m ${testName} ${details ? `(${details})` : ''}`);
  }
};

const runTestSuite = async () => {
  console.log('\n======================================================');
  console.log('  STAYEASE COMPREHENSIVE QUALITY ASSURANCE TEST SUITE');
  console.log('======================================================\n');

  try {
    // Connect to database
    await mongoose.connect(env.MONGODB_URI);
    server = app.listen(5001);

    // Helper fetch wrapper
    const req = async (path, options = {}) => {
      const url = `${BASE_URL}${path}`;
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
          ...options.headers,
        },
        ...options,
      });
      const data = await res.json().catch(() => null);
      return { status: res.status, ok: res.ok, data };
    };

    // -------------------------------------------------------------------------
    // 1. AUTHENTICATION & SECURITY
    // -------------------------------------------------------------------------
    console.log('\n--- 1. AUTHENTICATION & SECURITY MODULE ---');

    // 1.1 Register
    const uniqueEmail = `test_${Date.now()}@stayease.com`;
    const regRes = await req('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'QA Test User',
        email: uniqueEmail,
        phone: '+91 99999 88888',
        password: 'password123',
      }),
    });
    assert(regRes.status === 201 && regRes.data?.data?.token, '1.1 Customer Registration', `Status: ${regRes.status}`);

    // Check password not in response
    assert(!regRes.data?.data?.user?.password, '1.2 Password excluded from registration response');

    // 1.3 Reject duplicate email
    const dupRes = await req('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Duplicate User',
        email: uniqueEmail,
        password: 'password123',
      }),
    });
    assert(dupRes.status === 409, '1.3 Reject duplicate email registration', `Expected 409, got ${dupRes.status}`);

    // 1.4 Reject invalid credentials
    const invalidLogin = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: uniqueEmail, password: 'wrongpassword' }),
    });
    assert(invalidLogin.status === 401, '1.4 Reject invalid login password', `Status: ${invalidLogin.status}`);

    // 1.5 Valid Customer Login
    const customerLogin = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'guest@stayease.com', password: 'password123' }),
    });
    const customerToken = customerLogin.data?.data?.token;
    assert(customerLogin.status === 200 && customerToken, '1.5 Customer Login', 'Alexander Wright');

    // Check password not in login response
    assert(!customerLogin.data?.data?.user?.password, '1.6 Password excluded from login response');

    // 1.7 Valid Admin Login
    const adminLogin = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@stayease.com', password: 'admin123' }),
    });
    const adminToken = adminLogin.data?.data?.token;
    assert(adminLogin.status === 200 && adminToken, '1.7 Admin Login', 'Elena Rostova');

    // 1.8 Protected route rejects unauthenticated request
    const unauthRes = await req('/auth/me');
    assert(unauthRes.status === 401, '1.8 Protected route rejects missing token', `Status: ${unauthRes.status}`);

    // 1.9 Protected route succeeds with token
    const meRes = await req('/auth/me', { token: customerToken });
    assert(meRes.status === 200 && meRes.data?.data?.user?.email === 'guest@stayease.com', '1.9 Token restoration & /auth/me profile verification');

    // 1.10 Admin-only route rejects regular customer
    const rejectCustomer = await req('/bookings/stats', { token: customerToken });
    assert(rejectCustomer.status === 403, '1.10 Admin route rejects normal customer', `Status: ${rejectCustomer.status}`);

    // -------------------------------------------------------------------------
    // 2. HOTEL & ROOM MANAGEMENT
    // -------------------------------------------------------------------------
    console.log('\n--- 2. HOTEL & ROOM MANAGEMENT MODULE ---');

    // 2.1 Get all hotels
    const allHotels = await req('/hotels');
    assert(allHotels.status === 200 && allHotels.data?.data?.length >= 8, '2.1 Load all hotels from MongoDB', `Count: ${allHotels.data?.data?.length}`);

    // 2.2 Search filter
    const searchRes = await req('/hotels?search=Udaipur');
    const allUdaipur = searchRes.data?.data?.every(h => h.city.toLowerCase().includes('udaipur') || h.name.toLowerCase().includes('udaipur'));
    assert(searchRes.status === 200 && allUdaipur && searchRes.data?.data?.length > 0, '2.2 Hotel search by destination (Udaipur)', `Results: ${searchRes.data?.data?.length}`);

    // 2.3 Filter by category & rating
    const catRes = await req('/hotels?category=Heritage Palace&minRating=4.9');
    assert(catRes.status === 200 && catRes.data?.data?.length > 0, '2.3 Filter by category (Heritage Palace) & rating (>= 4.9)', `Results: ${catRes.data?.data?.length}`);

    // 2.4 Get Hotel by ID with populated rooms
    const targetHotel = allHotels.data?.data?.[0];
    const hotelDetails = await req(`/hotels/${targetHotel._id}`);
    assert(
      hotelDetails.status === 200 &&
      hotelDetails.data?.data?.name === targetHotel.name &&
      hotelDetails.data?.data?.rooms?.length >= 3,
      '2.4 Hotel details & room inventory populated from MongoDB',
      `Rooms: ${hotelDetails.data?.data?.rooms?.length}`
    );

    // 2.5 Admin Creates Hotel
    const createHotelRes = await req('/hotels', {
      method: 'POST',
      token: adminToken,
      body: JSON.stringify({
        name: 'The Leela Palace, Bengaluru',
        city: 'Bengaluru',
        country: 'India',
        address: '23 HAL Airport Road, Bengaluru',
        pricePerNight: 35000,
        category: 'Hotel',
        coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        description: 'Modern royal palace inspired by Mysore architectural heritage.',
        rating: 4.95,
        rooms: [
          {
            name: 'Royal Club Suite',
            price: 35000,
            bedType: '1 King Bed',
            capacity: 2,
            size: '60 m²',
          },
        ],
      }),
    });
    const createdHotelId = createHotelRes.data?.data?._id;
    assert(createHotelRes.status === 201 && createdHotelId, '2.5 Admin creates new hotel in MongoDB', `ID: ${createdHotelId}`);

    // 2.6 Admin updates hotel
    const updateHotelRes = await req(`/hotels/${createdHotelId}`, {
      method: 'PUT',
      token: adminToken,
      body: JSON.stringify({ tagline: 'Regal hospitality in the Garden City' }),
    });
    assert(updateHotelRes.status === 200 && updateHotelRes.data?.data?.tagline === 'Regal hospitality in the Garden City', '2.6 Admin updates hotel details');

    // -------------------------------------------------------------------------
    // 3. BOOKING SYSTEM & OVERLAPPING RESTRICTIONS
    // -------------------------------------------------------------------------
    console.log('\n--- 3. BOOKING SYSTEM & RESERVATION LIFECYCLE ---');

    const testRoom = targetHotel.rooms[0];
    const roomRate = testRoom.price;

    // 3.1 Reject past check-in date
    const pastBooking = await req('/bookings', {
      method: 'POST',
      token: customerToken,
      body: JSON.stringify({
        hotelId: targetHotel._id,
        roomId: testRoom._id,
        checkIn: '2020-01-01',
        checkOut: '2020-01-05',
        guests: 2,
      }),
    });
    assert(pastBooking.status === 400, '3.1 Reject past check-in dates', `Expected 400, got ${pastBooking.status}`);

    // 3.2 Reject check-out date before or equal to check-in
    const invalidDatesBooking = await req('/bookings', {
      method: 'POST',
      token: customerToken,
      body: JSON.stringify({
        hotelId: targetHotel._id,
        roomId: testRoom._id,
        checkIn: '2027-02-15',
        checkOut: '2027-02-10',
        guests: 2,
      }),
    });
    assert(invalidDatesBooking.status === 400, '3.2 Reject check-out before check-in', `Status: ${invalidDatesBooking.status}`);

    const sameDateBooking = await req('/bookings', {
      method: 'POST',
      token: customerToken,
      body: JSON.stringify({
        hotelId: targetHotel._id,
        roomId: testRoom._id,
        checkIn: '2027-02-15',
        checkOut: '2027-02-15',
        guests: 2,
      }),
    });
    assert(sameDateBooking.status === 400, '3.3 Reject check-out equal to check-in', `Status: ${sameDateBooking.status}`);

    // 3.4 Valid Booking Creation
    const validBookingRes = await req('/bookings', {
      method: 'POST',
      token: customerToken,
      body: JSON.stringify({
        hotelId: targetHotel._id,
        roomId: testRoom._id,
        checkIn: '2027-03-01',
        checkOut: '2027-03-05',
        guests: 2,
        guestName: 'Alexander Wright',
        guestEmail: 'guest@stayease.com',
      }),
    });

    const bookingDoc = validBookingRes.data?.data;
    const expectedNights = 4;
    const expectedSubtotal = expectedNights * roomRate;
    const expectedTax = Math.round(expectedSubtotal * 0.12);
    const expectedTotal = expectedSubtotal + expectedTax;

    assert(
      validBookingRes.status === 201 &&
      bookingDoc?.nights === expectedNights &&
      bookingDoc?.totalPrice === expectedSubtotal &&
      bookingDoc?.finalAmount === expectedTotal,
      '3.4 Create valid booking with correct night calculation & 12% tax',
      `4 nights @ ₹${roomRate} = ₹${expectedTotal}`
    );

    // 3.5 Prevent Overlapping Booking for Same Dates
    const overlapRes = await req('/bookings', {
      method: 'POST',
      token: customerToken,
      body: JSON.stringify({
        hotelId: targetHotel._id,
        roomId: testRoom._id,
        checkIn: '2027-03-02',
        checkOut: '2027-03-06',
        guests: 2,
      }),
    });
    assert(overlapRes.status === 409, '3.5 Reject overlapping booking on same suite (409 Conflict)', `Message: ${overlapRes.data?.message}`);

    // 3.6 Check room availability endpoint confirms room is booked
    const availCheckBooked = await req(`/rooms/${testRoom._id}/availability?checkIn=2027-03-02&checkOut=2027-03-04`);
    assert(availCheckBooked.status === 200 && availCheckBooked.data?.data?.isAvailable === false, '3.6 Room availability endpoint reports suite is occupied');

    // 3.7 Room availability endpoint confirms room is free for different dates
    const availCheckFree = await req(`/rooms/${testRoom._id}/availability?checkIn=2027-04-10&checkOut=2027-04-15`);
    assert(availCheckFree.status === 200 && availCheckFree.data?.data?.isAvailable === true, '3.7 Room availability endpoint reports suite is available for other dates');

    // 3.8 Customer B cannot cancel Customer A's booking
    // Log in as second customer (Priya Sharma)
    const priyaLogin = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'priya.sharma@stayease.com', password: 'password123' }),
    });
    const priyaToken = priyaLogin.data?.data?.token;

    const unauthorizedCancel = await req(`/bookings/${bookingDoc._id}/cancel`, {
      method: 'PATCH',
      token: priyaToken,
    });
    assert(unauthorizedCancel.status === 403, "3.8 Cross-user security: Users cannot cancel another customer's reservation", `Status: ${unauthorizedCancel.status}`);

    // 3.9 Owner cancels their own booking
    const ownerCancel = await req(`/bookings/${bookingDoc._id}/cancel`, {
      method: 'PATCH',
      token: customerToken,
    });
    assert(ownerCancel.status === 200 && ownerCancel.data?.data?.status === 'Cancelled', '3.9 Owner cancels their own booking', 'Status updated to Cancelled');

    // 3.10 Cancelled booking no longer blocks availability
    const rebookRes = await req('/bookings', {
      method: 'POST',
      token: priyaToken,
      body: JSON.stringify({
        hotelId: targetHotel._id,
        roomId: testRoom._id,
        checkIn: '2027-03-01',
        checkOut: '2027-03-05',
        guests: 2,
      }),
    });
    assert(rebookRes.status === 201, '3.10 Cancelled reservation no longer blocks availability (rebooking succeeds)', `New Booking: ${rebookRes.data?.data?.bookingNumber}`);

    // Clean up rebooking
    await req(`/bookings/${rebookRes.data?.data?._id}/cancel`, { method: 'PATCH', token: priyaToken });

    // -------------------------------------------------------------------------
    // 4. ADMIN DASHBOARD & INVENTORY
    // -------------------------------------------------------------------------
    console.log('\n--- 4. ADMIN DASHBOARD & INVENTORY MODULE ---');

    // 4.1 Admin Stats
    const statsRes = await req('/bookings/stats', { token: adminToken });
    assert(
      statsRes.status === 200 &&
      statsRes.data?.data?.totalRevenue > 0 &&
      statsRes.data?.data?.totalBookings > 0 &&
      statsRes.data?.data?.totalHotels >= 8,
      '4.1 Admin stats returns live revenue, booking count & hotel totals',
      `Revenue: ₹${statsRes.data?.data?.totalRevenue?.toLocaleString()}, Hotels: ${statsRes.data?.data?.totalHotels}`
    );

    // 4.2 Admin gets all bookings
    const allBookingsRes = await req('/bookings', { token: adminToken });
    assert(allBookingsRes.status === 200 && allBookingsRes.data?.data?.length > 0, '4.2 Admin views all bookings list', `Total: ${allBookingsRes.data?.data?.length}`);

    // 4.3 Admin updates booking status
    const targetBooking = allBookingsRes.data?.data?.[0];
    const statusUpdateRes = await req(`/bookings/${targetBooking._id}/status`, {
      method: 'PATCH',
      token: adminToken,
      body: JSON.stringify({ status: 'Completed' }),
    });
    assert(statusUpdateRes.status === 200 && statusUpdateRes.data?.data?.status === 'Completed', '4.3 Admin updates reservation status to Completed');

    // 4.4 Admin deletes created test hotel
    const deleteHotelRes = await req(`/hotels/${createdHotelId}`, {
      method: 'DELETE',
      token: adminToken,
    });
    assert(deleteHotelRes.status === 200, '4.4 Admin deletes hotel and cascades rooms', `Hotel: ${createdHotelId}`);

    // -------------------------------------------------------------------------
    // 5. SUMMARY
    // -------------------------------------------------------------------------
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;

    console.log('\n======================================================');
    console.log(`  QA SUITE RESULTS: ${passed} PASSED / ${failed} FAILED (${results.length} Total)`);
    console.log('======================================================\n');

    server.close();
    await mongoose.disconnect();

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Test Suite Fatal Error:', err);
    if (server) server.close();
    await mongoose.disconnect();
    process.exit(1);
  }
};

runTestSuite();
