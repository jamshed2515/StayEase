import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required.';

    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please provide a valid email address.';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required for booking confirmations.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validate()) return;

    try {
      const res = await register(formData);
      if (res.success) {
        navigate('/');
      }
    } catch (err) {
      setFormError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center text-teal-400 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-navy-900">
              Stay<span className="text-primary-600">Ease</span>
            </span>
          </Link>
          <h2 className="font-serif text-3xl font-bold text-navy-950">
            Create Your Account
          </h2>
          <p className="text-xs text-navy-600">
            Join the StayEase Privilege Club for bespoke reservations and special rates.
          </p>
        </div>

        {/* Register Form Card */}
        <Card className="p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-card">
          {formError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Julian Sterling"
              leftIcon={User}
              value={formData.name}
              error={errors.name}
              onChange={(e) => {
                setFormData((p) => ({ ...p, name: e.target.value }));
                if (errors.name) setErrors((p) => ({ ...p, name: '' }));
              }}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@domain.com"
              leftIcon={Mail}
              value={formData.email}
              error={errors.email}
              onChange={(e) => {
                setFormData((p) => ({ ...p, email: e.target.value }));
                if (errors.email) setErrors((p) => ({ ...p, email: '' }));
              }}
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              leftIcon={Phone}
              value={formData.phone}
              error={errors.phone}
              onChange={(e) => {
                setFormData((p) => ({ ...p, phone: e.target.value }));
                if (errors.phone) setErrors((p) => ({ ...p, phone: '' }));
              }}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Minimum 6 characters"
              leftIcon={Lock}
              value={formData.password}
              error={errors.password}
              onChange={(e) => {
                setFormData((p) => ({ ...p, password: e.target.value }));
                if (errors.password) setErrors((p) => ({ ...p, password: '' }));
              }}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              leftIcon={Lock}
              value={formData.confirmPassword}
              error={errors.confirmPassword}
              onChange={(e) => {
                setFormData((p) => ({ ...p, confirmPassword: e.target.value }));
                if (errors.confirmPassword)
                  setErrors((p) => ({ ...p, confirmPassword: '' }));
              }}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="teal"
                size="lg"
                isLoading={loading}
                className="w-full rounded-xl shadow-md h-12 text-sm"
                rightIcon={ArrowRight}
              >
                Create Account
              </Button>
            </div>
          </form>

          {/* Footer Link */}
          <p className="text-center text-xs text-navy-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-700 hover:underline">
              Sign In
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

