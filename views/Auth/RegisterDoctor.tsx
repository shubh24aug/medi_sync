
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../../types.ts';
import { db } from '../../services/databaseService.ts';
import { Lock, Mail, User as UserIcon, Award, ShieldCheck, ChevronLeft } from 'lucide-react';

interface RegisterDoctorProps {
  onLogin: (user: User) => void;
}

const RegisterDoctor: React.FC<RegisterDoctorProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    licenseNumber: '',
    specialty: 'General Physician'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if email already exists
    if (db.getUserByEmail(formData.email)) {
      alert("This email is already registered. Please login.");
      navigate('/login');
      return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: UserRole.DOCTOR,
      profileActive: false, // Pending admin approval
      avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase()
    };

    db.saveUser(newUser);
    onLogin(newUser);
    alert("Application submitted! Admins will verify your license. You can now login as Admin (admin@example.com) to approve your profile.");
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white p-12 rounded-[40px] shadow-2xl shadow-blue-100 border border-slate-100">
        <div className="mb-12">
          <button 
            onClick={() => navigate('/login')}
            className="group text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-6 flex items-center transition-all"
          >
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Portal
          </button>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Professional Onboarding</h1>
          <p className="text-slate-500 mt-2 font-medium">Apply to join our elite medical network and access AI-assisted tools.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Full Legal Name</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Jane Smith"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition-all font-medium text-slate-700"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Medical License ID</label>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  required
                  placeholder="MD-XXXXX"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition-all font-medium text-slate-700"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Professional Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="doctor@hospital.com"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition-all font-medium text-slate-700"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Set Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="password"
                  required
                  placeholder="Secure password"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition-all font-medium text-slate-700"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Primary Specialty</label>
              <div className="relative group">
                <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <select
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition-all font-bold text-slate-700 appearance-none"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                >
                  <option>General Physician</option>
                  <option>Cardiologist</option>
                  <option>Neurologist</option>
                  <option>Dermatologist</option>
                  <option>Pediatrician</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100 flex items-start space-x-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-blue-900 mb-1">Verification Required</h3>
              <p className="text-xs text-blue-700/70 leading-relaxed font-medium">
                To ensure patient safety, all doctor accounts require manual license verification by an Admin. After submission, you can log in to view your application status.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-black uppercase tracking-[0.1em] py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 active:scale-[0.98] text-sm"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterDoctor;
