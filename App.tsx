
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.tsx';
import Login from './views/Auth/Login.tsx';
import RegisterDoctor from './views/Auth/RegisterDoctor.tsx';
import AdminDashboard from './views/Admin/AdminDashboard.tsx';
import DoctorDashboard from './views/Doctor/DoctorDashboard.tsx';
import PatientDashboard from './views/Patient/PatientDashboard.tsx';
import DoctorBooking from './views/Patient/DoctorBooking.tsx';
import { User, UserRole } from './types.ts';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('medi_sync_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('medi_sync_user');
      }
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('medi_sync_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('medi_sync_user');
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header user={user} onLogout={handleLogout} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            {/* Root path handles initial redirection */}
            <Route path="/" element={
              user ? (
                user.role === UserRole.ADMIN ? <Navigate to="/admin" /> :
                user.role === UserRole.DOCTOR ? <Navigate to="/doctor" /> :
                <Navigate to="/patient" />
              ) : <Navigate to="/login" />
            } />
            
            {/* Login and Register paths redirect to root if already logged in */}
            <Route path="/login" element={
              user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
            } />
            <Route path="/register-doctor" element={
              user ? <Navigate to="/" /> : <RegisterDoctor onLogin={handleLogin} />
            } />
            
            {/* Protected Role-Based Routes */}
            <Route path="/admin" element={user?.role === UserRole.ADMIN ? <AdminDashboard /> : <Navigate to="/login" />} />
            <Route path="/doctor" element={user?.role === UserRole.DOCTOR ? <DoctorDashboard user={user} /> : <Navigate to="/login" />} />
            <Route path="/patient" element={user?.role === UserRole.PATIENT ? <PatientDashboard user={user} /> : <Navigate to="/login" />} />
            <Route path="/book/:doctorId" element={user?.role === UserRole.PATIENT ? <DoctorBooking user={user} /> : <Navigate to="/login" />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
