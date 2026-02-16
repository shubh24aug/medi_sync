
import React from 'react';

interface FormFieldProps {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ 
  label, type = 'text', name, value, onChange, placeholder, required, error, icon, children 
}) => {
  const isSelect = type === 'select';
  
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors">
            {icon}
          </div>
        )}
        
        {isSelect ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full ${icon ? 'pl-12' : 'pl-6'} pr-6 py-4 bg-slate-50 border ${error ? 'border-red-300' : 'border-slate-100'} rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition-all font-bold text-slate-700 appearance-none`}
          >
            {children}
          </select>
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`w-full ${icon ? 'pl-12' : 'pl-6'} pr-6 py-4 bg-slate-50 border ${error ? 'border-red-300' : 'border-slate-100'} rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition-all font-medium text-slate-700`}
          />
        )}
      </div>
      {error && <p className="text-[10px] font-bold text-red-500 ml-2 animate-in fade-in slide-in-from-top-1">{error}</p>}
    </div>
  );
};

export default FormField;
