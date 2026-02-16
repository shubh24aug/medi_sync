
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../../types.ts';
import { db } from '../../services/databaseService.ts';
import FormField from '../../components/FormField.tsx';
import { Lock, Mail, User as UserIcon, Heart, ChevronLeft, ShieldCheck } from 'lucide-react';

interface RegisterPatientProps {
  onLogin: (user: User) => void;
}

const RegisterPatient: React.FC<RegisterPatientProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    if (db.getUserByEmail(formData.email)) {
      setErrors({ email: 'This email is already registered.' });
      return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: UserRole.PATIENT,
      profileActive: true,
      avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase()
    };

    db.saveUser(newUser);
    onLogin(newUser);
    navigate('/patient');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="max-w-md mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-blue-100 border border-slate-100">
        <div className="mb-10 text-center">
          <button onClick={() => navigate('/login')} className="group text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-6 flex items-center justify-center transition-all mx-auto">
            <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Portal
          </button>
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Heart size={32} fill="currentColor" className="opacity-80" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create Account</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required error={errors.name} icon={<UserIcon size={20}/>} />
          <FormField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required error={errors.email} icon={<Mail size={20}/>} />
          <FormField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Min 6 characters" required error={errors.password} icon={<Lock size={20}/>} />

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-3">
            <ShieldCheck className="text-blue-500" size={18} />
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-tight">Secure biometric-ready local storage enabled.</p>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-black uppercase py-5 rounded-2xl hover:bg-blue-700 shadow-2xl shadow-blue-200 active:scale-[0.98] transition-all">
            Join MediSync
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPatient;
