import React, { useState } from 'react';
import {
  Sparkles,
  BedDouble,
  MapPin,
  Star,
  Coffee,
  Wifi,
  Tv,
  Check,
  Search,
  Mail,
  Lock,
  Calendar,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Input } from '../common/Input';
import { Spinner } from '../common/Spinner';

export const ComponentShowcase = () => {
  const [btnLoading, setBtnLoading] = useState(false);
  const [testInput, setTestInput] = useState('');

  return (
    <section className="py-12 space-y-10">
      <div className="border-b border-sand-200 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="navy" size="sm">
            Design System Foundation
          </Badge>
        </div>
        <h2 className="font-serif text-3xl font-bold text-navy-950">
          Reusable Component Architecture
        </h2>
        <p className="text-sm text-navy-600 mt-1">
          Standardized, modular, and accessible components adhering to StayEase luxury hospitality design guidelines.
        </p>
      </div>

      {/* 1. Buttons Showcase */}
      <Card>
        <CardHeader>
          <CardTitle>1. Action Buttons</CardTitle>
          <CardDescription>
            Multi-variant buttons with support for icons, sizes, loading states, and disabled styling.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary Navy</Button>
            <Button variant="gold" leftIcon={Sparkles}>
              Gold Accent
            </Button>
            <Button variant="secondary">Secondary Neutral</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost Link</Button>
            <Button variant="danger">Danger</Button>
            <Button
              variant="gold"
              isLoading={btnLoading}
              onClick={() => {
                setBtnLoading(true);
                setTimeout(() => setBtnLoading(false), 2000);
              }}
            >
              Click For Loading State
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2. Badges & Tags */}
      <Card>
        <CardHeader>
          <CardTitle>2. Badges & Status Indicators</CardTitle>
          <CardDescription>
            Pill tags for booking statuses, room amenities, and luxury certifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="gold" dot>
              Forbes 5-Star
            </Badge>
            <Badge variant="success" dot>
              Instant Confirmation
            </Badge>
            <Badge variant="warning" dot>
              Only 2 Suites Left
            </Badge>
            <Badge variant="danger" dot>
              Sold Out
            </Badge>
            <Badge variant="info" dot>
              Free Cancellation
            </Badge>
            <Badge variant="navy">VIP Butler Service</Badge>
            <Badge variant="neutral">Private Balcony</Badge>
          </div>
        </CardContent>
      </Card>

      {/* 3. Inputs & Forms */}
      <Card>
        <CardHeader>
          <CardTitle>3. Form Inputs</CardTitle>
          <CardDescription>
            Engineered with icon decorators, focused rings, validation feedback, and clean typography.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Guest Email Address"
              type="email"
              placeholder="guest@domain.com"
              leftIcon={Mail}
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              helperText="Booking confirmation will be sent here."
            />
            <Input
              label="Reservation Security Code"
              type="password"
              placeholder="••••••••"
              leftIcon={Lock}
            />
            <Input
              label="Required Input With Validation"
              placeholder="e.g. Special Dietary Request"
              error="This field is required for VIP catering."
            />
          </div>
        </CardContent>
      </Card>

      {/* 4. Luxury Hotel Property Card Preview */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-navy-900">
            4. Composite Card: Luxury Suite Preview
          </h3>
          <p className="text-sm text-navy-600">
            Demonstrates compound components, image overlay, badges, typography, and action triggers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Property Card 1 */}
          <Card hover className="overflow-hidden group">
            <div className="relative h-56 overflow-hidden bg-sand-200">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
                alt="The Azure Grand Cliff Resort"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute top-3 right-3">
                <Badge variant="navy" className="backdrop-blur-sm bg-navy-900/90 text-white">
                  Santorini
                </Badge>
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-900/80 backdrop-blur-sm text-white text-xs">
                <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                <span className="font-semibold">4.96</span>
                <span className="text-navy-300">(148 reviews)</span>
              </div>
            </div>

            <CardHeader>
              <div className="flex items-center justify-between text-xs text-gold-700 font-semibold uppercase tracking-wider mb-1">
                <span>Presidential Suite</span>
                <span>Ocean View</span>
              </div>
              <CardTitle>The Azure Grand Cliff Resort</CardTitle>
              <CardDescription className="flex items-center gap-1 text-xs text-navy-500">
                <MapPin className="w-3.5 h-3.5 text-navy-400" />
                Oia Caldera Cliffside, Greece
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-4 text-xs text-navy-600 py-2 border-y border-sand-100">
                <div className="flex items-center gap-1">
                  <Coffee className="w-3.5 h-3.5 text-gold-600" />
                  <span>Breakfast Incl.</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wifi className="w-3.5 h-3.5 text-gold-600" />
                  <span>High-Speed Wi-Fi</span>
                </div>
                <div className="flex items-center gap-1">
                  <BedDouble className="w-3.5 h-3.5 text-gold-600" />
                  <span>King Bed</span>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <div>
                <span className="text-xs text-navy-500 block">From</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-navy-900 font-serif">$680</span>
                  <span className="text-xs text-navy-500">/ night</span>
                </div>
              </div>
              <Button variant="gold" size="sm">
                View Suite
              </Button>
            </CardFooter>
          </Card>

          {/* Property Card 2 */}
          <Card hover className="overflow-hidden group">
            <div className="relative h-56 overflow-hidden bg-sand-200">
              <img
                src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80"
                alt="Villa Amanpuri Retreat"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute top-3 right-3">
                <Badge variant="gold" dot>
                  Featured Stay
                </Badge>
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-900/80 backdrop-blur-sm text-white text-xs">
                <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                <span className="font-semibold">4.98</span>
                <span className="text-navy-300">(210 reviews)</span>
              </div>
            </div>

            <CardHeader>
              <div className="flex items-center justify-between text-xs text-gold-700 font-semibold uppercase tracking-wider mb-1">
                <span>Private Pool Villa</span>
                <span>Beachfront</span>
              </div>
              <CardTitle>Villa Amanpuri Retreat</CardTitle>
              <CardDescription className="flex items-center gap-1 text-xs text-navy-500">
                <MapPin className="w-3.5 h-3.5 text-navy-400" />
                Phuket Panwa Peninsula, Thailand
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-4 text-xs text-navy-600 py-2 border-y border-sand-100">
                <div className="flex items-center gap-1">
                  <Coffee className="w-3.5 h-3.5 text-gold-600" />
                  <span>Floating Breakfast</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wifi className="w-3.5 h-3.5 text-gold-600" />
                  <span>Free Starlink</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tv className="w-3.5 h-3.5 text-gold-600" />
                  <span>Cinema Room</span>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <div>
                <span className="text-xs text-navy-500 block">From</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-navy-900 font-serif">$920</span>
                  <span className="text-xs text-navy-500">/ night</span>
                </div>
              </div>
              <Button variant="gold" size="sm">
                View Suite
              </Button>
            </CardFooter>
          </Card>

          {/* Property Card 3 */}
          <Card hover className="overflow-hidden group">
            <div className="relative h-56 overflow-hidden bg-sand-200">
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"
                alt="Palais Royal Saint-Germain"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute top-3 right-3">
                <Badge variant="navy" className="backdrop-blur-sm bg-navy-900/90 text-white">
                  Paris
                </Badge>
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-900/80 backdrop-blur-sm text-white text-xs">
                <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                <span className="font-semibold">4.92</span>
                <span className="text-navy-300">(89 reviews)</span>
              </div>
            </div>

            <CardHeader>
              <div className="flex items-center justify-between text-xs text-gold-700 font-semibold uppercase tracking-wider mb-1">
                <span>Haute Heritage Suite</span>
                <span>Historic</span>
              </div>
              <CardTitle>Palais Saint-Germain</CardTitle>
              <CardDescription className="flex items-center gap-1 text-xs text-navy-500">
                <MapPin className="w-3.5 h-3.5 text-navy-400" />
                6th Arrondissement, Paris, France
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-4 text-xs text-navy-600 py-2 border-y border-sand-100">
                <div className="flex items-center gap-1">
                  <Coffee className="w-3.5 h-3.5 text-gold-600" />
                  <span>Artisan Bakery</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wifi className="w-3.5 h-3.5 text-gold-600" />
                  <span>Wi-Fi 6</span>
                </div>
                <div className="flex items-center gap-1">
                  <BedDouble className="w-3.5 h-3.5 text-gold-600" />
                  <span>Emperor Bed</span>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <div>
                <span className="text-xs text-navy-500 block">From</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-navy-900 font-serif">$850</span>
                  <span className="text-xs text-navy-500">/ night</span>
                </div>
              </div>
              <Button variant="gold" size="sm">
                View Suite
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* 5. Loaders */}
      <Card>
        <CardHeader>
          <CardTitle>5. Loading Spinners</CardTitle>
          <CardDescription>
            Harmonious loading animations matching the brand color palette.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Spinner size="sm" color="gold" />
              <span className="text-xs text-navy-600">Gold Small</span>
            </div>
            <div className="flex items-center gap-2">
              <Spinner size="md" color="navy" />
              <span className="text-xs text-navy-600">Navy Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <Spinner size="lg" color="gold" />
              <span className="text-xs text-navy-600">Gold Large</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

