import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  action,
}) => {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 transition-shadow ${className}`}>
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between pb-3 mb-3 border-b border-slate-100">
          <div>
            {title && <h3 className="text-base font-bold text-slate-900 leading-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
