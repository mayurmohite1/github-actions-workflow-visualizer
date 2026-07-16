import { ReactNode } from 'react';

export const Badge = ({ children, variant = 'default' }: { children: ReactNode; variant?: 'default' | 'success' | 'warning' | 'error' }) => {
  const variantStyles = {
    default: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded ${variantStyles[variant]}`}>
      {children}
    </span>
  );
};
