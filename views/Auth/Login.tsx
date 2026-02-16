
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../../types.ts';
import { db } from '../../services/databaseService.ts';
import { Mail, Lock, LogIn, ChevronRight, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.PATIENT);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const user = db.authenticate(email, password);
    
    if (user) {
      onLogin(user);
      navigate('/');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  const handleMockGoogleLogin = () => {
    // Determine a default email based on role for the mock button
    const mockEmail = `${selectedRole.toLowerCase()}@example.com`;
    let user = db.getUserByEmail(mockEmail);

    if (!user) {
      // Auto-create user if not found (simulating first-time Google sign-in)
      // Generic names used instead of specific people
      user = {
        id: Math.random().toString(36).substr(2, 9),
        name: selectedRole === UserRole.PATIENT ? 'New Patient' : (selectedRole === UserRole.ADMIN ? 'Admin User' : 'Doctor User'),
        email: mockEmail,
        role: selectedRole,
        profileActive: selectedRole !== UserRole.DOCTOR,
        avatar: selectedRole === UserRole.PATIENT ? 'NP' : (selectedRole === UserRole.ADMIN ? 'AD' : 'DU')
      };
      db.saveUser(user);
    }

    onLogin(user);
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto mt-12 mb-20 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white p-10 rounded-[32px] shadow-2xl shadow-blue-100/50 border border-slate-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-6 shadow-xl shadow-blue-200">M</div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Health Portal</h1>
          <p className="text-slate-500 font-medium">Access your medical workspace</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-600 animate-in slide-in-from-top-2">
            <AlertCircle size={18} />
            <p className="text-xs font-bold uppercase tracking-wider">{error}</p>
          </div>
        )}

        <form onSubmit={handleFormLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition-all font-medium text-slate-700"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition-all font-medium text-slate-700"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 active:scale-[0.98]"
          >
            <span>Sign In</span>
            <LogIn size={18} />
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Or continue with</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl mb-2">
            {(Object.values(UserRole) as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`py-2 px-1 text-[10px] font-black rounded-lg transition-all uppercase tracking-tighter ${
                  selectedRole === role
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleMockGoogleLogin}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-[0.98]"
          >
            <img src="https://www.gstatic.com/images/branding/product/1x/g_32dp.png" alt="Google" className="w-5 h-5" />
            <span className="font-bold text-slate-700 text-sm">Google Account</span>
          </button>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-slate-500 font-medium">
            Are you a medical professional?{' '}
            <button 
              onClick={() => navigate('/register-doctor')}
              className="text-blue-600 font-bold hover:underline inline-flex items-center"
            >
              Apply to join <ChevronRight size={14} className="ml-0.5" />
            </button>
          </p>
        </div>
      </div>

      <div className="mt-8 p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 text-[11px] text-indigo-700/80 font-bold leading-relaxed shadow-sm">
        <p className="uppercase tracking-widest text-indigo-400 mb-2">Sample Credentials</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-indigo-900">ADMIN</p>
            <p>admin@example.com / admin</p>
          </div>
          <div>
            <p className="text-indigo-900">PATIENT</p>
            <p>patient@example.com / password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
