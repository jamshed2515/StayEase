import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-sand-200 flex items-center justify-center text-primary-700 mx-auto">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-primary-700 uppercase tracking-widest">
            Error 404
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy-950">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-navy-600">
            The sanctuary you are looking for does not exist or has been relocated.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link to="/">
            <Button variant="teal" size="sm" leftIcon={Home}>
              Return Home
            </Button>
          </Link>
          <Link to="/hotels">
            <Button variant="outline" size="sm" leftIcon={Compass}>
              Explore Hotels
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

