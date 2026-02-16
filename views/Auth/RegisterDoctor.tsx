
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../../types.ts';

interface RegisterDoctorProps {
  onLogin: (user: User) => void;
}

const RegisterDoctor: React.FC<RegisterDoctorProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    licenseNumber: '',
    specialty: 'General Physician'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      role: UserRole.DOCTOR,
      profileActive: false, // Pending admin approval
    };
    onLogin(newUser);
    alert("Application submitted! Admins will verify your license. Redirecting to your dashboard...");
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <button 
          onClick={() => navigate('/login')}
          className="text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest mb-4 flex items-center transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          Back to Login
        </button>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Join our Doctor Network</h1>
        <p className="text-slate-500 mt-2">Empower patients with AI-assisted healthcare management.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Jane Smith"
              className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-400 outline-none transition-all font-medium"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="jane.smith@hospital.com"
              className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-400 outline-none transition-all font-medium"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Medical License ID</label>
            <input
              type="text"
              required
              placeholder="MD-XXXXX"
              className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-400 outline-none transition-all font-medium"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Specialty</label>
            <select
              className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-400 outline-none transition-all font-bold text-slate-700"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
            >
              <option>General Physician</option>
              <option>Cardiologist</option>
              <option>Neurologist</option>
              <option>Dermatologist</option>
              <option>Pediatrician</option>
            </select>
          </div>
        </div>

        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
          <h3 className="text-sm font-bold text-blue-800 mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Verification Process
          </h3>
          <p className="text-xs text-blue-700/70 leading-relaxed font-medium">
            Our admin team verifies licenses with the national medical council. Verification usually takes 1-2 business days. You will be notified via email and push notification on your linked Android device.
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-[0.98]"
        >
          Submit Professional Application
        </button>
      </form>
    </div>
  );
};

export default RegisterDoctor;
