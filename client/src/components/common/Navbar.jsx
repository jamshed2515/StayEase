import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Compass,
  Calendar,
  PhoneCall,
  Menu,
  X,
  User,
  LogOut,
  ShieldAlert,
  ChevronDown,
  BookmarkCheck,
  Building2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from './Button';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinkStyle = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? 'text-primary-700 font-semibold'
        : 'text-navy-700 hover:text-navy-950'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-sand-200/80 shadow-subtle transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-900 to-navy-800 flex items-center justify-center text-primary-400 shadow-md shadow-navy-900/10 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-navy-900">
                Stay<span className="text-primary-600">Ease</span>
              </span>
              <span className="block text-[10px] uppercase tracking-[0.2em] font-medium text-navy-500">
                Find your perfect stay.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={navLinkStyle}>
              Home
            </NavLink>
            <NavLink to="/hotels" className={navLinkStyle}>
              Explore Hotels
            </NavLink>
            <NavLink to="/my-bookings" className={navLinkStyle}>
              My Bookings
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/admin"
                className="text-xs uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-200 flex items-center gap-1 hover:bg-primary-100 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Admin Portal
              </NavLink>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/hotels"
              className="flex items-center gap-2 text-xs font-medium text-navy-600 hover:text-navy-900 transition-colors py-2 px-3 rounded-lg hover:bg-sand-100"
            >
              <Compass className="w-3.5 h-3.5 text-primary-600" />
              <span>Explore Stays</span>
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-full border border-sand-200 hover:border-sand-300 hover:bg-sand-50 transition-colors"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-500/20"
                  />
                  <div className="text-left hidden xl:block">
                    <p className="text-xs font-semibold text-navy-900 leading-tight">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-primary-700 font-medium capitalize">
                      {user.role}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-navy-400 mr-1" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-sand-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-sand-100">
                      <p className="text-xs font-semibold text-navy-900">{user.name}</p>
                      <p className="text-[11px] text-navy-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/my-bookings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-navy-700 hover:bg-sand-50 transition-colors"
                    >
                      <BookmarkCheck className="w-4 h-4 text-primary-600" />
                      <span>My Bookings</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-navy-700 hover:bg-sand-50 transition-colors"
                      >
                        <Building2 className="w-4 h-4 text-primary-600" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 transition-colors border-t border-sand-100"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Log In
                </Button>
                <Button
                  variant="teal"
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-navy-700 hover:bg-sand-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-sand-200 bg-white px-4 pt-4 pb-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-navy-800 hover:bg-sand-100"
            >
              Home
            </Link>
            <Link
              to="/hotels"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-navy-800 hover:bg-sand-100"
            >
              Explore Hotels
            </Link>
            <Link
              to="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-navy-800 hover:bg-sand-100"
            >
              My Bookings
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100"
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          <div className="pt-3 border-t border-sand-200">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-2">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-navy-900">{user.name}</p>
                    <p className="text-xs text-navy-500">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-rose-600 hover:bg-rose-50"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  leftIcon={LogOut}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                >
                  Log In
                </Button>
                <Button
                  variant="teal"
                  className="w-full justify-center"
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
