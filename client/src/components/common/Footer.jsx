import React from 'react';
import { Sparkles, Mail, MapPin, Phone, Award, Shield, HeartHandshake } from 'lucide-react';
import { Button } from './Button';

export const Footer = () => {
  return (
    <footer className="bg-navy-950 text-sand-200 pt-16 pb-12 border-t border-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Vision */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold-500/20 flex items-center justify-center text-gold-400 border border-gold-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Stay<span className="text-gold-400">Ease</span>
              </span>
            </div>
            <p className="text-sm text-navy-300 leading-relaxed max-w-sm">
              StayEase curates the world&apos;s most distinctive hotels, private villas, and bespoke
              resorts. Where world-class architecture meets effortless, personalized hospitality.
            </p>
            <div className="flex items-center gap-6 pt-2 text-xs text-navy-400">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-gold-400" />
                <span>Forbes 5-Star Partner</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-gold-400" />
                <span>Verified Clean Stays</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold-400 font-semibold mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-navy-300">
              <li>
                <a href="#destinations" className="hover:text-white transition-colors">
                  Global Destinations
                </a>
              </li>
              <li>
                <a href="#properties" className="hover:text-white transition-colors">
                  Signature Suites
                </a>
              </li>
              <li>
                <a href="#experiences" className="hover:text-white transition-colors">
                  Curated Dining
                </a>
              </li>
              <li>
                <a href="#wellness" className="hover:text-white transition-colors">
                  Wellness & Spas
                </a>
              </li>
            </ul>
          </div>

          {/* Guest Services */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold-400 font-semibold mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm text-navy-300">
              <li>
                <a href="#concierge" className="hover:text-white transition-colors">
                  24/7 Concierge
                </a>
              </li>
              <li>
                <a href="#booking-policy" className="hover:text-white transition-colors">
                  Flexible Cancellation
                </a>
              </li>
              <li>
                <a href="#loyalty" className="hover:text-white transition-colors">
                  StayEase Privilege Club
                </a>
              </li>
              <li>
                <a href="#health-status" className="hover:text-white transition-colors">
                  System Diagnostics
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold-400 font-semibold mb-4">
              Privilege Newsletter
            </h4>
            <p className="text-xs text-navy-400 mb-3">
              Receive private invitations, seasonal specials, and member-only retreats.
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-navy-900 border border-navy-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-navy-500 focus:outline-none focus:border-gold-500"
              />
              <Button variant="gold" size="sm" className="w-full justify-center">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-navy-900 flex flex-col md:flex-row items-center justify-between text-xs text-navy-400 gap-4">
          <p>© {new Date().getFullYear()} StayEase International Hospitality. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-sand-200 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-sand-200 transition-colors">
              Terms of Service
            </a>
            <a href="#cookies" className="hover:text-sand-200 transition-colors">
              Cookie Preferences
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

