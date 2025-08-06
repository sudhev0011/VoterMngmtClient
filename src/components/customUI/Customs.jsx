import { AlertCircle } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";


export const Button = ({ children, variant = 'default', size = 'default', className = '', onClick, disabled, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  
  const variants = {
    default: 'bg-slate-900 text-white hover:bg-slate-800',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-slate-200 hover:bg-slate-50 hover:text-slate-900',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    ghost: 'hover:bg-slate-100 hover:text-slate-900',
    success: 'bg-green-600 text-white hover:bg-green-700'
  };
  
  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md',
    icon: 'h-10 w-10'
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className = '' }) => (
  <div className={`rounded-lg border bg-white border-slate-200 shadow-sm ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

export const Input = ({ className = '', ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

export const Select = ({ children, value, onChange, className = '' }) => (
  <select
    value={value}
    onChange={onChange}
    className={`flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  >
    {children}
  </select>
);

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-slate-900 text-white',
    secondary: 'bg-slate-100 text-slate-900',
    destructive: 'bg-red-500 text-white',
    success: 'bg-green-500 text-white'
  };
  
  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export const Alert = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-blue-50 border-blue-200 text-blue-800',
    destructive: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  };
  
  return (
    <div className={`relative w-full rounded-lg border p-4 ${variants[variant]} ${className}`}>
      <div className="flex items-center">
        <AlertCircle className="h-4 w-4 mr-2" />
        {children}
      </div>
    </div>
  );
};

export const SkeletonDiv = () => {
  return (
    <div className="flex flex-col gap-2 px-4">
      <Skeleton className="h-6 w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12" />
      <Skeleton className="h-6 w-full sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-7/12" />
      <Skeleton className="h-6 w-full sm:w-11/12 md:w-9/12 lg:w-7/12 xl:w-6/12" />
      <Skeleton className="h-6 w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12" />
      <Skeleton className="h-6 w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12" />
      <Skeleton className="h-6 w-full sm:w-9/12 md:w-7/12 lg:w-5/12 xl:w-4/12" />
      <Skeleton className="h-6 w-full sm:w-9/12 md:w-6/12 lg:w-5/12 xl:w-3/12" />
      <Skeleton className="h-6 w-full sm:w-8/12 md:w-6/12 lg:w-4/12 xl:w-3/12" />
      <Skeleton className="h-6 w-full sm:w-7/12 md:w-5/12 lg:w-3/12 xl:w-2/12" />
    </div>
  );
};