import mongoose from 'mongoose';
import { env } from './config/env.js';
import { User } from './models/User.js';
import { Hotel } from './models/Hotel.js';
import { Room } from './models/Room.js';
import { Booking } from './models/Booking.js';
import { logger } from './utils/logger.js';

const seedData = async () => {
  try {
    logger.info('Connecting to MongoDB for seeding...');
    await mongoose.connect(env.MONGODB_URI);
    logger.database(`Connected to ${env.MONGODB_URI}`);

    // Clean existing collections
    await User.deleteMany({});
    await Hotel.deleteMany({});
    await Room.deleteMany({});
    await Booking.deleteMany({});
    logger.info('Cleared previous database collections.');

    // 1. Create Users
    logger.info('Creating user accounts...');
    const adminUser = await User.create({
      name: 'Elena Rostova',
      email: 'admin@stayease.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 98765 43210',
      avatar:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      memberTier: 'Executive Administrator',
    });

    const customerUser1 = await User.create({
      name: 'Alexander Wright',
      email: 'guest@stayease.com',
      password: 'password123',
      role: 'user',
      phone: '+91 91234 56789',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      memberTier: 'Platinum Member',
    });

    const customerUser2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya.sharma@stayease.com',
      password: 'password123',
      role: 'user',
      phone: '+91 98111 22334',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      memberTier: 'Gold Member',
    });

    logger.success('User accounts created successfully.');

    // 2. Define 8 Indian Luxury Hotels
    const hotelsData = [
      {
        name: 'The Oberoi Udaivilas',
        tagline: 'Palatial royalty situated on the tranquil shores of Lake Pichola',
        city: 'Udaipur',
        country: 'India',
        address: 'Haridas Ji Ki Magri, Mulla Talai, Udaipur, Rajasthan 313001',
        rating: 4.98,
        reviewCount: 342,
        category: 'Heritage Palace',
        pricePerNight: 38000,
        originalPrice: 45000,
        featured: true,
        coverImage:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80',
        ],
        description:
          'Conceived as a traditional Indian palace, The Oberoi Udaivilas showcases the rich heritage of the Mewar region of Rajasthan. Boasting sprawling courtyards, gentle rippling fountains, reflective swimming pools, and sweeping vistas across Lake Pichola.',
        amenities: [
          'Free High-Speed Wi-Fi',
          'Lake Facing Semi-Private Pool',
          'Fine Dining Mewari Restaurant',
          'Oberoi Ayurvedic Spa',
          'Private Shikara Boat Rides',
          '24/7 Personal Butler',
          'Valet Parking',
          'Helipad Access',
        ],
        scores: { cleanliness: 5.0, location: 5.0, service: 4.98, amenities: 4.95, value: 4.9 },
        reviews: [
          {
            author: 'Rohan Singhania',
            rating: 5,
            date: 'October 2026',
            avatar:
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
            comment:
              'The arrival across Lake Pichola by private boat set an unforgettable tone. Service is peerless.',
          },
        ],
        rooms: [
          {
            name: 'Premier Lake View Room',
            bedType: '1 King Bed',
            capacity: 2,
            size: '56 m²',
            price: 38000,
            image:
              'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80',
            features: [
              'Lake Pichola Panorama',
              'Marble Soaking Bath',
              'Complimentary Rajasthani High Tea',
              'Espresso Bar',
            ],
          },
          {
            name: 'Luxury Suite with Private Pool',
            bedType: '1 Emperor Bed',
            capacity: 2,
            size: '105 m²',
            price: 65000,
            image:
              'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
            features: [
              'Heated Private Pool',
              'Outdoor Dining Pavilion',
              'Dedicated Butler',
              'Welcome Champagne',
            ],
          },
          {
            name: 'Kohinoor Royal Presidential Suite',
            bedType: '2 King Beds',
            capacity: 4,
            size: '240 m²',
            price: 125000,
            image:
              'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80',
            features: [
              'Private Palace Courtyard',
              'Sauna & Steam Pavilion',
              'Personal Master Chef',
              'Chauffeured Rolls-Royce',
            ],
          },
        ],
      },
      {
        name: 'Rambagh Palace, Jaipur',
        tagline: 'The Jewel of Jaipur — Former residence of the Maharaja of Jaipur',
        city: 'Jaipur',
        country: 'India',
        address: 'Bhawani Singh Road, Jaipur, Rajasthan 302005',
        rating: 4.97,
        reviewCount: 289,
        category: 'Heritage Palace',
        pricePerNight: 45000,
        originalPrice: 52000,
        featured: true,
        coverImage:
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
        ],
        description:
          'Walk in the footsteps of royalty at Rambagh Palace, fondly termed the Jewel of Jaipur. Presenting 75 extravagant suites with hand-carved marble jalis, sandstone balustrades, ornamental gardens inhabited by peacocks, and celebrated vintage polo lounges.',
        amenities: [
          'Free High-Speed Wi-Fi',
          'Indoor & Outdoor Heated Pools',
          'Suvarna Mahal Fine Dining',
          'Jiva Grande Spa',
          'Vintage Car Airport Transfer',
          'Peacock Garden Trails',
          'Royal Butler Service',
        ],
        scores: { cleanliness: 4.99, location: 4.96, service: 5.0, amenities: 4.94, value: 4.88 },
        reviews: [
          {
            author: 'Ananya Deshmukh',
            rating: 5,
            date: 'November 2026',
            avatar:
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            comment:
              'Dine at Suvarna Mahal under Florentine chandeliers. Rambagh Palace redefined royalty for our family.',
          },
        ],
        rooms: [
          {
            name: 'Palace Garden View Room',
            bedType: '1 King Bed',
            capacity: 2,
            size: '50 m²',
            price: 45000,
            image:
              'https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=600&q=80',
            features: [
              'Peacock Lawn Vista',
              'Antique Rajasthani Decor',
              'Italian Marble Bathroom',
              'Royal Tea Service',
            ],
          },
          {
            name: 'Historical Peacock Suite',
            bedType: '1 Emperor Bed',
            capacity: 2,
            size: '90 m²',
            price: 75000,
            image:
              'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80',
            features: [
              'Archway Veranda',
              'Private Sunken Jacuzzi',
              'Dedicated Royal Butler',
              'Silverware Breakfast',
            ],
          },
          {
            name: 'Maharani Grand Presidential Suite',
            bedType: '2 King Beds',
            capacity: 4,
            size: '180 m²',
            price: 160000,
            image:
              'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80',
            features: [
              'Original Maharaja Furnishings',
              'Private Terrace Balcony',
              'Vintage Rolls Royce Chauffeur',
              'Sommelier Wine Cellar Access',
            ],
          },
        ],
      },
      {
        name: 'W Goa Beachfront Retreat',
        tagline: 'Vibrant luxury set upon the pristine sands of Vagator Beach',
        city: 'Goa',
        country: 'India',
        address: 'Vagator Beach, Bardez, Goa 403509',
        rating: 4.93,
        reviewCount: 256,
        category: 'Resort',
        pricePerNight: 24000,
        originalPrice: 28000,
        featured: true,
        coverImage:
          'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
        ],
        description:
          'Where the dramatic red cliffs of Vagator meet the warm Arabian Sea. W Goa seamlessly blends bold Portuguese-Goan design with private plunge pools, vibrant sunset lounge decks, the AWAY Spa, and curated beachside seafood grills.',
        amenities: [
          'Free High-Speed Wi-Fi',
          'WET Outdoor Infinity Pool',
          'Rock Pool Sunset Lounge',
          'AWAY Wellness Spa',
          'Direct Beach Access',
          'Fitness Center',
          'Complimentary Airport Pick-Up',
        ],
        scores: { cleanliness: 4.94, location: 4.98, service: 4.92, amenities: 4.96, value: 4.86 },
        reviews: [
          {
            author: 'Kabir Mehta',
            rating: 5,
            date: 'September 2026',
            avatar:
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
            comment:
              'Sunset at the Rock Pool with great beats and coastal cocktails is unbeatable in North Goa.',
          },
        ],
        rooms: [
          {
            name: 'Wonderful Garden Oasis Room',
            bedType: '1 King Bed',
            capacity: 2,
            size: '52 m²',
            price: 24000,
            image:
              'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80',
            features: [
              'Private Balcony',
              'Rainforest Shower',
              'Signature W Bed',
              'Complimentary Gourmet Breakfast',
            ],
          },
          {
            name: 'Spectacular Ocean View Chalet',
            bedType: '1 King Bed',
            capacity: 2,
            size: '75 m²',
            price: 42000,
            image:
              'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
            features: [
              'Direct Arabian Sea View',
              'Private Plunge Pool',
              'Sunset Sundowner Hamper',
              'Espresso Bar',
            ],
          },
          {
            name: 'WOW Presidential 2-Bedroom Villa',
            bedType: '2 King Beds',
            capacity: 4,
            size: '160 m²',
            price: 85000,
            image:
              'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
            features: [
              'Private Beachfront Lawn',
              'Exclusive Lap Pool',
              'Dedicated Concierge Butler',
              'Private DJ Deck Option',
            ],
          },
        ],
      },
      {
        name: 'Kumarakom Lake Resort, Kerala',
        tagline: 'Emerald backwater retreat with heritage villas and meandering swimming channels',
        city: 'Kerala',
        country: 'India',
        address: 'Vembanad Lake, Kumarakom, Kottayam, Kerala 686563',
        rating: 4.95,
        reviewCount: 310,
        category: 'Resort',
        pricePerNight: 22000,
        originalPrice: 26000,
        featured: true,
        coverImage:
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80',
        ],
        description:
          'Recognized among the finest luxury heritage resorts in Asia. Reconstructed from traditional 16th-century ancestral Kerala homes, Kumarakom Lake Resort rests along the serene shores of Lake Vembanad with open-air courtyard baths and authentic Ayurvedic sanctuaries.',
        amenities: [
          'Free High-Speed Wi-Fi',
          'Meandering 250m Swimming Pool',
          'Ayurmana Certified Ayurvedic Spa',
          'Sunset Vembanad Boat Cruise',
          'Traditional Seafood Choolah',
          'Yoga & Meditation Pavilions',
          'Air Conditioning',
        ],
        scores: { cleanliness: 4.97, location: 4.98, service: 4.96, amenities: 4.93, value: 4.91 },
        reviews: [
          {
            author: 'Maya Nair',
            rating: 5,
            date: 'August 2026',
            avatar:
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            comment:
              'Stepping straight from the bedroom verandah into the meandering pool was bliss. Pure peace.',
          },
        ],
        rooms: [
          {
            name: 'Heritage Meandering Pool Villa',
            bedType: '1 King Bed',
            capacity: 2,
            size: '60 m²',
            price: 22000,
            image:
              'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80',
            features: [
              'Direct Pool Access from Verandah',
              'Open-Air Courtyard Bath',
              'Kerala Teak Woodwork',
              'Breakfast Included',
            ],
          },
          {
            name: 'Backwater Luxury Pavilion',
            bedType: '1 King Bed',
            capacity: 2,
            size: '80 m²',
            price: 36000,
            image:
              'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
            features: [
              'Panoramic Lake Vembanad View',
              'Private Plunge Jacuzzi',
              'Daily Sunset Boat Ride',
              'In-Villa Ayurvedic Treatment',
            ],
          },
          {
            name: 'Traditional Luxury Kettuvallam Suite',
            bedType: '1 Emperor Bed',
            capacity: 2,
            size: '95 m²',
            price: 52000,
            image:
              'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
            features: [
              'Private Overnight Houseboat',
              'Dedicated Captain & Master Chef',
              'Fresh Catch Dining',
              'Starlink Wi-Fi',
            ],
          },
        ],
      },
      {
        name: 'The Taj Mahal Palace, Mumbai',
        tagline: 'Legendary harbour-facing grandeur standing proud since 1903',
        city: 'Mumbai',
        country: 'India',
        address: 'Apollo Bunder, Colaba, Mumbai, Maharashtra 400001',
        rating: 4.96,
        reviewCount: 420,
        category: 'Hotel',
        pricePerNight: 28000,
        originalPrice: 34000,
        featured: true,
        coverImage:
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=1000&q=80',
        ],
        description:
          'An enduring architectural marvel overlooking the Gateway of India and the Arabian Sea. The Taj Mahal Palace has welcomed kings, dignitaries, and global titans for over a century, offering Michelin-grade dining across 9 restaurants and pristine white-glove hospitality.',
        amenities: [
          'Free High-Speed Wi-Fi',
          'Harbour-Facing Swimming Pool',
          'Wasabi by Morimoto Japanese Dining',
          'Jiva Spa & Wellness Pavilion',
          'Historical Heritage Walking Tours',
          'Valet Parking',
          '24/7 Concierge Service',
        ],
        scores: { cleanliness: 4.98, location: 5.0, service: 4.97, amenities: 4.94, value: 4.89 },
        reviews: [
          {
            author: 'Vikram Godrej',
            rating: 5,
            date: 'October 2026',
            avatar:
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
            comment:
              'Unmatched poise and elegance. High tea at the Sea Lounge watching the harbour boats is timeless.',
          },
        ],
        rooms: [
          {
            name: 'Tower City Wing Deluxe Room',
            bedType: '1 King Bed',
            capacity: 2,
            size: '42 m²',
            price: 28000,
            image:
              'https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=600&q=80',
            features: [
              'South Mumbai Skyline View',
              'Italian Marble Bath',
              'Taj Club Lounge Access',
              'Breakfast Included',
            ],
          },
          {
            name: 'Heritage Wing Gateway Suite',
            bedType: '1 King Bed',
            capacity: 2,
            size: '72 m²',
            price: 58000,
            image:
              'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80',
            features: [
              'Direct Gateway of India Vista',
              'Antique Rosewood Desk',
              'Personal Butler 24/7',
              'Welcome Bollinger Champagne',
            ],
          },
          {
            name: 'Tata Grand Presidential Suite',
            bedType: '2 King Beds',
            capacity: 4,
            size: '190 m²',
            price: 180000,
            image:
              'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80',
            features: [
              'Full Arabian Sea Panorama',
              'Private Spa Therapy Room',
              'Bulletproof Security Glass',
              'Chauffeured Jaguar Transfer',
            ],
          },
        ],
      },
      {
        name: 'Wildflower Hall, An Oberoi Resort, Shimla',
        tagline: 'Majestic Himalayan fortress surrounded by 22 acres of protected cedar forest',
        city: 'Shimla',
        country: 'India',
        address: 'Chharabra, Shimla, Himachal Pradesh 171012',
        rating: 4.96,
        reviewCount: 198,
        category: 'Resort',
        pricePerNight: 32000,
        originalPrice: 38000,
        featured: false,
        coverImage:
          'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
        ],
        description:
          'Perched at an elevation of 8,250 feet amidst fragrant pine and cedar woodlands, Wildflower Hall captures the romance of colonial mountain estates. Featuring an open-air heated whirlpool overlooking snow-capped peaks and crackling log fireplaces.',
        amenities: [
          'Free High-Speed Wi-Fi',
          'Outdoor Heated Mountain Jacuzzi',
          'Indoor Chandelier-Lit Pool',
          'Forest Bathing & Trekking Guides',
          'Mountain Biking Trails',
          'Log Fireplace Lounges',
          'Oberoi Spa in the Forest',
        ],
        scores: { cleanliness: 4.99, location: 4.97, service: 4.96, amenities: 4.95, value: 4.88 },
        reviews: [
          {
            author: 'Aarav Singhal',
            rating: 5,
            date: 'January 2026',
            avatar:
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
            comment:
              'Sitting in the heated outdoor jacuzzi with snowfall all around and mountain panorama was pure magic.',
          },
        ],
        rooms: [
          {
            name: 'Deluxe Cedar Forest Room',
            bedType: '1 King Bed',
            capacity: 2,
            size: '48 m²',
            price: 32000,
            image:
              'https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&w=600&q=80',
            features: [
              'Virgin Pine Canopy Views',
              'Teak Wood Paneling',
              'Heated Bathroom Flooring',
              'Artisan Breakfast',
            ],
          },
          {
            name: 'Premier Snow Mountain View Suite',
            bedType: '1 King Bed',
            capacity: 2,
            size: '70 m²',
            price: 54000,
            image:
              'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
            features: [
              'Unobstructed Himalayan Peaks',
              'Working Wood Fireplace',
              'Private Sun Balcony',
              'Personal Butler',
            ],
          },
          {
            name: 'Lord Kitchener Heritage Suite',
            bedType: '2 King Beds',
            capacity: 4,
            size: '140 m²',
            price: 95000,
            image:
              'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80',
            features: [
              'Victorian Fireplaces',
              'Private Dining Salon',
              'Vintage Telescope Station',
              'Private Bonfire Arrangement',
            ],
          },
        ],
      },
      {
        name: 'BrijRama Palace Heritage Haven',
        tagline: '18th-century stone palace standing sentinel over Darbhanga Ghat on the holy Ganges',
        city: 'Varanasi',
        country: 'India',
        address: 'Darbhanga Ghat, Dashashwamedh, Varanasi, Uttar Pradesh 221001',
        rating: 4.94,
        reviewCount: 165,
        category: 'Heritage Palace',
        pricePerNight: 26000,
        originalPrice: 30000,
        featured: false,
        coverImage:
          'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
        ],
        description:
          'Rising magnificently from the banks of the sacred Ganges River, BrijRama Palace is one of the oldest heritage structures in Varanasi. Accessible via private handcrafted wooden bajra boats, offering soul-stirring morning classical sitar recitals.',
        amenities: [
          'Free High-Speed Wi-Fi',
          'Private Wooden Bajra Boat Transfers',
          'Rooftop Ganga Aarti Viewing Deck',
          'Pure Vegetarian Royal Dining',
          'Classical Sitar & Tabla Mornings',
          'Elevator Access (Historical Feat)',
          'Air Conditioning',
        ],
        scores: { cleanliness: 4.96, location: 5.0, service: 4.95, amenities: 4.9, value: 4.88 },
        reviews: [
          {
            author: 'Deepak Varma',
            rating: 5,
            date: 'November 2026',
            avatar:
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
            comment:
              'Watching the sunrise over the Ganges while classical flute played on the terrace was a spiritual high.',
          },
        ],
        rooms: [
          {
            name: 'Nadidhara Ganges View Room',
            bedType: '1 King Bed',
            capacity: 2,
            size: '42 m²',
            price: 26000,
            image:
              'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80',
            features: [
              'Direct Holy Ganges River View',
              'Hand-carved Sandstone Walls',
              'Complimentary Aarti Boat Tour',
              'Breakfast Included',
            ],
          },
          {
            name: 'Maharaja Royal Palace Suite',
            bedType: '1 Emperor Bed',
            capacity: 2,
            size: '68 m²',
            price: 48000,
            image:
              'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
            features: [
              'Arched Balcony Facing River',
              'Silver-Inlaid Furniture',
              'Private Sitar Performance',
              'VIP Ghat Escort',
            ],
          },
          {
            name: 'Varuna Royal Terrace Penthouse',
            bedType: '2 King Beds',
            capacity: 4,
            size: '120 m²',
            price: 72000,
            image:
              'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80',
            features: [
              'Exclusive Ghat Rooftop',
              'Personal Butler Service',
              'Private Puja Arrangement',
              'Gourmet Multi-Course Banquets',
            ],
          },
        ],
      },
      {
        name: 'The Oberoi Amarvilas, Agra',
        tagline: 'Every single suite enjoys an uninterrupted, breathtaking view of the iconic Taj Mahal',
        city: 'Agra',
        country: 'India',
        address: 'Taj East Gate Road, Agra, Uttar Pradesh 282001',
        rating: 4.97,
        reviewCount: 388,
        category: 'Heritage Palace',
        pricePerNight: 40000,
        originalPrice: 48000,
        featured: true,
        coverImage:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
        ],
        description:
          'Located a mere 600 meters from the Taj Mahal. Designed in Moorish and Mughal styles with terraced lawns, cascading fountains, reflection pools, and cobalt blue colonnades, providing romantic views of the monument of love from every guest room.',
        amenities: [
          'Free High-Speed Wi-Fi',
          'Terraced Tiered Swimming Pool',
          'Esphahan Fine Indian Dining',
          'Private Golf Cart to Taj Mahal',
          'Oberoi Ayurvedic Spa',
          '24/7 Dedicated Butler',
          'Valet Parking',
        ],
        scores: { cleanliness: 4.99, location: 5.0, service: 4.98, amenities: 4.96, value: 4.9 },
        reviews: [
          {
            author: 'Rachel Chen',
            rating: 5,
            date: 'September 2026',
            avatar:
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            comment:
              'Waking up to the sunrise over the Taj Mahal straight from our pillow was the highlight of our entire trip to India.',
          },
        ],
        rooms: [
          {
            name: 'Premier Taj View Balcony Room',
            bedType: '1 King Bed',
            capacity: 2,
            size: '52 m²',
            price: 40000,
            image:
              'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80',
            features: [
              'Direct Taj Mahal Vista',
              'Mughal Arch Verandah',
              'Marble Deep Soaking Tub',
              'Breakfast Included',
            ],
          },
          {
            name: 'Deluxe Suite with Taj Panorama',
            bedType: '1 King Bed',
            capacity: 2,
            size: '80 m²',
            price: 68000,
            image:
              'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
            features: [
              'Private Open-Air Terrace',
              'Complimentary Golf Buggy',
              'Dedicated Butler',
              'Welcome Bollinger Champagne',
            ],
          },
          {
            name: 'Kohinoor Presidential Taj Suite',
            bedType: '2 King Beds',
            capacity: 4,
            size: '220 m²',
            price: 150000,
            image:
              'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80',
            features: [
              'Three Private View Terraces',
              'Personal Chef Dining',
              'Private Therapy Steam Room',
              'Chauffeured Mercedes Maybach',
            ],
          },
        ],
      },
    ];

    logger.info(`Seeding ${hotelsData.length} luxury hotels with suites...`);

    const createdHotels = [];
    const allCreatedRooms = [];

    for (const hData of hotelsData) {
      const { rooms, ...hotelFields } = hData;
      const hotelDoc = await Hotel.create(hotelFields);

      const roomDocs = rooms.map((r) => ({
        ...r,
        hotel: hotelDoc._id,
      }));

      const createdRooms = await Room.insertMany(roomDocs);
      createdHotels.push(hotelDoc);
      allCreatedRooms.push(...createdRooms);
    }

    logger.success(
      `Created ${createdHotels.length} hotels and ${allCreatedRooms.length} room types.`
    );

    // 3. Seed Sample Bookings
    logger.info('Seeding initial bookings...');
    const hotel1 = createdHotels[0]; // Udaivilas
    const room1 = allCreatedRooms.find(
      (r) => r.hotel.toString() === hotel1._id.toString()
    );

    const hotel2 = createdHotels[1]; // Rambagh Palace
    const room2 = allCreatedRooms.find(
      (r) => r.hotel.toString() === hotel2._id.toString()
    );

    const hotel3 = createdHotels[2]; // W Goa
    const room3 = allCreatedRooms.find(
      (r) => r.hotel.toString() === hotel3._id.toString()
    );

    await Booking.create([
      {
        bookingNumber: 'BK-9481',
        user: customerUser1._id,
        hotel: hotel1._id,
        room: room1._id,
        hotelName: hotel1.name,
        hotelImage: hotel1.coverImage,
        city: hotel1.city,
        country: hotel1.country,
        roomName: room1.name,
        guestName: customerUser1.name,
        guestEmail: customerUser1.email,
        guestPhone: customerUser1.phone,
        checkIn: new Date('2026-12-10'),
        checkOut: new Date('2026-12-15'),
        nights: 5,
        guests: 2,
        pricePerNight: room1.price,
        totalPrice: room1.price * 5,
        taxesAndFees: Math.round(room1.price * 5 * 0.12),
        finalAmount: Math.round(room1.price * 5 * 1.12),
        status: 'Confirmed',
        paymentMethod: 'HDFC Infinia Visa •••• 4242',
        specialRequests: 'High floor, quiet corner suite overlooking Lake Pichola.',
      },
      {
        bookingNumber: 'BK-8722',
        user: customerUser1._id,
        hotel: hotel2._id,
        room: room2._id,
        hotelName: hotel2.name,
        hotelImage: hotel2.coverImage,
        city: hotel2.city,
        country: hotel2.country,
        roomName: room2.name,
        guestName: customerUser1.name,
        guestEmail: customerUser1.email,
        guestPhone: customerUser1.phone,
        checkIn: new Date('2026-09-04'),
        checkOut: new Date('2026-09-08'),
        nights: 4,
        guests: 2,
        pricePerNight: room2.price,
        totalPrice: room2.price * 4,
        taxesAndFees: Math.round(room2.price * 4 * 0.12),
        finalAmount: Math.round(room2.price * 4 * 1.12),
        status: 'Completed',
        paymentMethod: 'Amex Centurion •••• 1004',
        specialRequests: 'Anniversary rose petal turndown arranged.',
      },
      {
        bookingNumber: 'BK-7130',
        user: customerUser2._id,
        hotel: hotel3._id,
        room: room3._id,
        hotelName: hotel3.name,
        hotelImage: hotel3.coverImage,
        city: hotel3.city,
        country: hotel3.country,
        roomName: room3.name,
        guestName: customerUser2.name,
        guestEmail: customerUser2.email,
        guestPhone: customerUser2.phone,
        checkIn: new Date('2026-07-12'),
        checkOut: new Date('2026-07-16'),
        nights: 4,
        guests: 2,
        pricePerNight: room3.price,
        totalPrice: room3.price * 4,
        taxesAndFees: Math.round(room3.price * 4 * 0.12),
        finalAmount: Math.round(room3.price * 4 * 1.12),
        status: 'Confirmed',
        paymentMethod: 'ICICI Sapphiro •••• 9921',
        specialRequests: 'Rock pool cabana reservation requested.',
      },
    ]);

    logger.success('Sample reservations seeded successfully.');
    logger.success('Database seeding finished successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Failed to seed database:', error);
    process.exit(1);
  }
};

seedData();

