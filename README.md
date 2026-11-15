# StayEase – Premium Hotel Booking Management System

StayEase is an enterprise-grade full-stack MERN (MongoDB, Express.js, React, Node.js) hotel booking management platform featuring role-based authentication, real-time suite reservation with conflict prevention, luxury Indian destinations, and an interactive administration dashboard.

---

## 🏛️ Project Architecture

```
StayEase – Hotel Booking Management System/
├── package.json                          # Root workspace runner with concurrently
├── .gitignore                            # Root version control ignore rules
├── .env.example                          # Root environment template
├── README.md                             # Comprehensive technical documentation
│
├── server/                               # Node.js + Express Backend API
│   ├── .env.example                      # Server environment template
│   ├── .env                              # Local server environment variables
│   ├── .gitignore                        # Server ignore rules
│   ├── package.json                      # Dependencies (bcryptjs, jsonwebtoken, mongoose, etc.)
│   └── src/
│       ├── config/
│       │   ├── db.js                     # Resilient Mongoose connection & status reporter
│       │   └── env.js                    # Validated environment configuration
│       ├── constants/
│       │   └── httpStatusCodes.js        # Standard HTTP status code constants
│       ├── controllers/
│       │   ├── authController.js         # Register, Login, GetMe, Logout
│       │   ├── hotelController.js        # CRUD, search, filter, sort
│       │   ├── roomController.js         # Suite & room management
│       │   ├── bookingController.js      # Booking lifecycle, date check, stats
│       │   └── healthController.js       # System health & diagnostics
│       ├── middlewares/
│       │   ├── authMiddleware.js         # JWT verify (protect) & role authorization (authorize)
│       │   ├── errorHandler.js           # Centralized global error handler
│       │   └── notFoundHandler.js        # 404 Route catch handler
│       ├── models/
│       │   ├── User.js                   # Mongoose User model with bcrypt hashing
│       │   ├── Hotel.js                  # Mongoose Hotel model with virtual room refs
│       │   ├── Room.js                   # Mongoose Room model with pricing & capacity
│       │   └── Booking.js                # Mongoose Booking model with snapshot data
│       ├── routes/
│       │   ├── authRoutes.js             # /api/v1/auth
│       │   ├── hotelRoutes.js            # /api/v1/hotels
│       │   ├── roomRoutes.js             # /api/v1/rooms
│       │   ├── bookingRoutes.js          # /api/v1/bookings
│       │   ├── healthRoutes.js           # /api/v1/health
│       │   └── index.js                  # Central API v1 router
│       ├── utils/
│       │   ├── apiError.js               # Standardized custom API error class
│       │   ├── apiResponse.js            # Standardized JSON response envelope
│       │   └── logger.js                 # Timestamped console logger
│       ├── app.js                        # Express setup with Helmet, CORS, Morgan
│       ├── server.js                     # HTTP server startup & graceful shutdown
│       └── seed.js                       # Comprehensive database seeder
│
└── client/                               # React 18 frontend with Vite & Tailwind CSS
    ├── .env.example                      # Client environment template
    ├── .env                              # Local client environment variables
    ├── .gitignore                        # Client ignore rules
    ├── index.html                        # HTML entry with Playfair Display & Plus Jakarta Sans
    ├── package.json                      # Frontend dependencies (React Router, Lucide, Axios)
    ├── postcss.config.js                 # PostCSS configuration
    ├── tailwind.config.js                # Custom palette: navy, primary teal, emerald, gold, sand
    ├── vite.config.js                    # Vite configuration with API proxy and path alias
    └── src/
        ├── api/
        │   └── axiosInstance.js          # Pre-configured Axios with JWT interceptors
        ├── components/
        │   ├── common/                   # Reusable Navbar, Footer, Button, Card, Input, Badge
        │   └── hotels/                   # HotelCard, FilterSidebar, ImageGallery, BookingWidget
        ├── contexts/
        │   ├── AuthContext.jsx           # Real JWT auth context with persistent session
        │   └── BookingContext.jsx        # MongoDB-backed booking state & operations
        ├── data/
        │   ├── destinationsData.js       # Curated Indian luxury travel destinations
        │   └── hotelsData.js             # Comprehensive hotel & suite backup dataset
        ├── layouts/
        │   └── MainLayout.jsx            # Global layout wrapper
        ├── pages/
        │   ├── HomePage.jsx              # Landing page with hero search & featured stays
        │   ├── ExploreHotelsPage.jsx     # Hotel catalog, live search, filters & sorting
        │   ├── HotelDetailsPage.jsx      # Gallery, description, suite selection, booking panel
        │   ├── LoginPage.jsx             # Login with validation & 1-click demo access
        │   ├── RegisterPage.jsx          # User registration with validation
        │   ├── MyBookingsPage.jsx        # Reservation history, status tabs, cancellation
        │   ├── AdminDashboardPage.jsx    # Real-time revenue/booking metrics & inventory
        │   └── NotFoundPage.jsx          # 404 Error page
        ├── services/
        │   ├── authService.js            # Auth API client
        │   ├── hotelService.js           # Hotel catalog API client
        │   ├── bookingService.js         # Booking API client
        │   └── healthService.js          # Health diagnostics API client
        ├── styles/
        │   └── index.css                 # Base styles and custom scrollbar
        ├── App.jsx                       # React Router configuration
        └── main.jsx                      # DOM mount point
```

---

## ⚡ Technology Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS 3.4, React Router DOM 6
- **Icons**: Lucide React
- **API Client**: Axios (configured with base URL, timeout, and request/response interceptors)
- **Backend**: Node.js v22 (ES Modules), Express.js 4.21
- **Database**: MongoDB with Mongoose 8
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs` password hashing
- **Security & Utilities**: Helmet, CORS, Morgan, dotenv, custom ApiError handling

---

## 🔐 Demo Credentials

The database seeder automatically populates the following verified accounts:

| Role | Name | Email | Password | Access Level |
|---|---|---|---|---|
| **Administrator** | Elena Rostova | `admin@stayease.com` | `admin123` | Full Admin Portal (`/admin`), Hotel CRUD, Booking Status Management |
| **Customer 1** | Alexander Wright | `guest@stayease.com` | `password123` | Guest Bookings, Profile, Reservation History |
| **Customer 2** | Priya Sharma | `priya.sharma@stayease.com` | `password123` | Guest Bookings, Profile, Reservation History |

> **Tip**: The `/login` page includes **1-Click Instant Demo Access** buttons for both Guest and Admin roles for swift reviewer testing.

---

## 📡 REST API Endpoints Reference

All endpoints are prefixed with `/api/v1`.

### 1. Authentication (`/api/v1/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register new user with name, email, phone, password |
| `POST` | `/auth/login` | Public | Authenticate user and return signed JWT token |
| `GET` | `/auth/me` | Private | Retrieve currently authenticated user profile |
| `POST` | `/auth/logout` | Private | Invalidate session / client logout |

### 2. Hotel Management (`/api/v1/hotels`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/hotels` | Public | List hotels with filters (`search`, `city`, `minPrice`, `maxPrice`, `minRating`, `sort`, `featured`) |
| `GET` | `/hotels/:id` | Public | Get single hotel details with populated room inventory |
| `POST` | `/hotels` | Admin | Create a new luxury hotel property with initial suites |
| `PUT` | `/hotels/:id` | Admin | Update hotel details or featured status |
| `DELETE` | `/hotels/:id` | Admin | Delete hotel and cascade delete its associated rooms |
| `GET` | `/hotels/:hotelId/rooms` | Public | Retrieve all rooms belonging to a hotel |
| `POST` | `/hotels/:hotelId/rooms` | Admin | Add a new room/suite to a hotel |

### 3. Room Management (`/api/v1/rooms`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/rooms` | Public | List rooms across hotels |
| `POST` | `/rooms` | Admin | Add room to a hotel |
| `PUT` | `/rooms/:id` | Admin | Update room specifications, price, or availability |
| `DELETE` | `/rooms/:id` | Admin | Remove room from hotel inventory |

### 4. Booking Management (`/api/v1/bookings`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/bookings` | Private | Reserve suite with date validation & **overlapping conflict prevention** |
| `GET` | `/bookings/my-bookings` | Private | Get authenticated user's reservation history |
| `GET` | `/bookings/:id` | Private | Get individual booking voucher details |
| `PATCH` | `/bookings/:id/cancel` | Private | Cancel reservation (free 48h cancellation policy) |
| `GET` | `/bookings` | Admin | View all customer bookings with search & status filters |
| `PATCH` | `/bookings/:id/status` | Admin | Update reservation status (`Confirmed`, `Completed`, `Cancelled`) |
| `DELETE` | `/bookings/:id` | Admin | Delete booking record |
| `GET` | `/bookings/stats` | Admin | System overview metrics (revenue, total bookings, active hotels) |

### 5. Diagnostics (`/api/v1/health`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Health status, database connection state, memory, uptime |
| `GET` | `/health/ping` | Public | Lightweight heartbeat ping |

---

## 🛡️ Overlapping Booking Prevention Logic

When a user initiates a reservation, the system validates that no confirmed reservation exists for the same suite during the requested date window:
```javascript
const overlappingReservation = await Booking.findOne({
  room: roomId,
  status: 'Confirmed',
  $and: [
    { checkIn: { $lt: checkOutDate } },
    { checkOut: { $gt: checkInDate } },
  ],
});
```
If an overlap is detected, the API rejects the request with `409 Conflict` and a clear message:
`"This suite is already reserved from YYYY-MM-DD to YYYY-MM-DD. Please select alternate dates or another suite."`

---

## 🚀 Getting Started & Execution Commands

### 1. Database Seeding
To populate MongoDB with admin accounts, customer accounts, 8 Indian luxury hotels (Udaipur, Jaipur, Goa, Kerala, Mumbai, Shimla, Varanasi, Agra), 24 suites, and initial bookings:

```bash
npm run seed
```

### 2. Run Both Backend & Frontend Simultaneously
From the project root:
```bash
npm run dev
```
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173`

### 3. Run Backend or Frontend Individually
```bash
# Terminal 1: Backend Server (Port 5000)
npm run dev:server

# Terminal 2: Frontend Client (Port 5173)
npm run dev:client
```

### 4. Build for Production
```bash
npm run build:client
```
Builds the optimized React client using Vite into `client/dist/`.
