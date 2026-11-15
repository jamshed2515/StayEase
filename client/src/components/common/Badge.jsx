import React from 'react';

const VARIANTS = {
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
  warning: 'bg-amber-50 text-amber-800 border-amber-200/60',
  danger: 'bg-rose-50 text-rose-800 border-rose-200/60',
  info: 'bg-sky-50 text-sky-800 border-sky-200/60',
  gold: 'bg-gold-50 text-gold-900 border-gold-300',
  navy: 'bg-navy-900 text-white border-navy-900',
  neutral: 'bg-sand-100 text-navy-800 border-sand-300',
};

const DOT_COLORS = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  info: 'bg-sky-500',
  gold: 'bg-gold-500',
  navy: 'bg-white',
  neutral: 'bg-navy-500',
};

export const Badge = ({
  children,
  variant = 'neutral',
  dot = false,
  className = '',
  size = 'md',
  ...props
}) => {
  const variantClass = VARIANTS[variant] || VARIANTS.neutral;
  const dotColor = DOT_COLORS[variant] || DOT_COLORS.neutral;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      {children}
    </span>
  );
};

