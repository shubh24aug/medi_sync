
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types.ts';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            MediSync
          </span>
        </Link>

        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <div className="text-sm text-slate-500 hidden md:block">
                Logged in as <span className="font-medium text-slate-900">{user.name}</span> ({user.role})
              </div>
              <button
                onClick={() => { onLogout(); navigate('/login'); }}
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600">
                Sign In
              </Link>
              <Link to="/register-doctor" className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all">
                Join as Doctor
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
