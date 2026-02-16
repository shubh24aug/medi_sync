
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import Login from './views/Auth/Login.tsx';
import RegisterDoctor from './views/Auth/RegisterDoctor.tsx';
import RegisterPatient from './views/Auth/RegisterPatient.tsx';
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
            <Route path="/" element={
              user ? (
                user.role === UserRole.ADMIN ? <Navigate to="/admin" /> :
                user.role === UserRole.DOCTOR ? <Navigate to="/doctor" /> :
                <Navigate to="/patient" />
              ) : <Navigate to="/login" />
            } />
            
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
            <Route path="/register-doctor" element={user ? <Navigate to="/" /> : <RegisterDoctor onLogin={handleLogin} />} />
            <Route path="/register-patient" element={user ? <Navigate to="/" /> : <RegisterPatient onLogin={handleLogin} />} />
            
            <Route path="/admin" element={
              <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="/doctor" element={
              <ProtectedRoute user={user} allowedRoles={[UserRole.DOCTOR]}>
                <DoctorDashboard user={user!} />
              </ProtectedRoute>
            } />

            <Route path="/patient" element={
              <ProtectedRoute user={user} allowedRoles={[UserRole.PATIENT]}>
                <PatientDashboard user={user!} />
              </ProtectedRoute>
            } />

            <Route path="/book/:doctorId" element={
              <ProtectedRoute user={user} allowedRoles={[UserRole.PATIENT]}>
                <DoctorBooking user={user!} />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
