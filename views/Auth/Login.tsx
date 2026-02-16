
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../../types.ts';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.PATIENT);
  const navigate = useNavigate();

  const handleMockGoogleLogin = () => {
    // Simulate Firebase/Google Auth
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: selectedRole === UserRole.PATIENT ? 'John Doe' : (selectedRole === UserRole.ADMIN ? 'Admin User' : 'Dr. Sarah Smith'),
      email: `${selectedRole.toLowerCase()}@example.com`,
      role: selectedRole,
      profileActive: selectedRole !== UserRole.DOCTOR,
    };
    onLogin(mockUser);
    // Navigate to root to trigger App.tsx redirection logic
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl shadow-xl shadow-blue-100 border border-slate-100 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
        <p className="text-slate-500">Secure access to your health workspace</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3 text-center uppercase tracking-widest">I am a...</label>
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
            {(Object.values(UserRole) as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                  selectedRole === role
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {role.charAt(0) + role.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleMockGoogleLogin}
          className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-[0.98]"
        >
          <img src="https://www.gstatic.com/images/branding/product/1x/g_32dp.png" alt="Google" className="w-5 h-5" />
          <span className="font-semibold text-slate-700">Continue with Google</span>
        </button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-400 font-bold uppercase tracking-widest text-[10px]">Secure Gateway</span>
          </div>
        </div>

        <div className="text-center text-sm text-slate-500">
          Want to register as a doctor?{' '}
          <button 
            onClick={() => navigate('/register-doctor')}
            className="text-blue-600 font-bold hover:underline"
          >
            Apply here
          </button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 text-[10px] text-blue-700 font-medium leading-relaxed">
        <strong>Pro-tip:</strong> MediSync uses AI to analyze your health trends automatically. Login to see your updated vitals.
      </div>
    </div>
  );
};

export default Login;
