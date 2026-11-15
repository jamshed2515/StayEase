import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Sparkles, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card, CardContent } from '../components/common/Card';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, demoLogin, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please provide a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validate()) return;

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate(res.user.role === 'admin' ? '/admin' : '/');
      }
    } catch (err) {
      setFormError(err.message || 'Login failed. Please check credentials.');
    }
  };

  const handleQuickDemo = async (role) => {
    try {
      const res = await demoLogin(role);
      navigate(role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setFormError(err.message || 'Demo login failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
            Welcome Back
          </h2>
          <p className="text-xs text-navy-600">
            Sign in to access your luxury reservations and concierge benefits.
          </p>
        </div>

        {/* Login Form Card */}
        <Card className="p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-card">
          {formError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@domain.com"
              leftIcon={Mail}
              value={email}
              error={errors.email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((p) => ({ ...p, email: '' }));
              }}
            />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-navy-700">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset instructions sent to your email address.');
                  }}
                  className="text-xs text-primary-700 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                leftIcon={Lock}
                value={password}
                error={errors.password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((p) => ({ ...p, password: '' }));
                }}
              />
            </div>

            <Button
              type="submit"
              variant="teal"
              size="lg"
              isLoading={loading}
              className="w-full rounded-xl shadow-md h-12 text-sm mt-2"
              rightIcon={ArrowRight}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-6 border-t border-sand-200 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-navy-500 text-center">
              Instant Demo Access:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickDemo('user')}
                leftIcon={User}
                className="text-xs font-medium"
              >
                Guest User
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickDemo('admin')}
                leftIcon={ShieldCheck}
                className="text-xs font-medium border-primary-200 text-primary-800 bg-primary-50/50 hover:bg-primary-50"
              >
                Administrator
              </Button>
            </div>
          </div>

          {/* Footer Link */}
          <p className="text-center text-xs text-navy-600 mt-6">
            Don&apos;t have a StayEase account?{' '}
            <Link to="/register" className="font-semibold text-primary-700 hover:underline">
              Create an account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

