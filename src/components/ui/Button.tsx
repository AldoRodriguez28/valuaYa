import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'emerald' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 shadow-xs';
  
  const variants = {
    primary: 'bg-[#1E3A8A] hover:bg-[#152a65] text-white shadow-navy-900/10 focus:ring-4 focus:ring-navy-100',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-4 focus:ring-slate-100',
    emerald: 'bg-[#059669] hover:bg-[#047857] text-white shadow-emerald-600/10 focus:ring-4 focus:ring-emerald-100',
    outline: 'bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-4 focus:ring-slate-100',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 focus:ring-2 focus:ring-slate-200 shadow-none',
  };

  const sizes = {
    sm: 'min-h-[40px] px-3 py-2 text-xs gap-1.5',
    md: 'min-h-[48px] px-5 py-3 text-sm gap-2', // Default 48px touch friendly
    lg: 'min-h-[54px] px-6 py-3.5 text-base gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
};
