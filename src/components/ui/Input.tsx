import React, { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  icon?: ReactNode;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  icon,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-slate-700 tracking-wide uppercase flex items-center justify-between"
        >
          <span>{label}</span>
          {props.required && <span className="text-rose-500 text-sm font-bold">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full min-h-[48px] px-4 py-3 text-base text-slate-900 bg-white border ${
            error ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-navy-900 focus:ring-navy-100'
          } rounded-xl shadow-xs transition-all duration-150 outline-none focus:ring-4 ${
            icon ? 'pl-11' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs font-medium text-rose-500">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};
