
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import Header from './components/Header.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import Login from './views/Auth/Login.tsx';
import RegisterDoctor from './views/Auth/RegisterDoctor.tsx';
import RegisterPatient from './views/Auth/RegisterPatient.tsx';
import AdminDashboard from './views/Admin/AdminDashboard.tsx';
import DoctorDashboard from './views/Doctor/DoctorDashboard.tsx';
import PatientDashboard from './views/Patient/PatientDashboard.tsx';
import DoctorBooking from './views/Patient/DoctorBooking.tsx';
import { UserRole } from './types.ts';

const AppRoutes: React.FC = () => {
  const { user, login, logout, isLoading } = useAuth();

  if (isLoading) return null; // Or a splash screen

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header user={user} onLogout={logout} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={
            user ? (
              user.role === UserRole.ADMIN ? <Navigate to="/admin" /> :
              user.role === UserRole.DOCTOR ? <Navigate to="/doctor" /> :
              <Navigate to="/patient" />
            ) : <Navigate to="/login" />
          } />
          
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={login} />} />
          <Route path="/register-doctor" element={user ? <Navigate to="/" /> : <RegisterDoctor onLogin={login} />} />
          <Route path="/register-patient" element={user ? <Navigate to="/" /> : <RegisterPatient onLogin={login} />} />
          
          <Route path="/admin" element={
            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/doctor" element={
            <ProtectedRoute user={user} allowedRoles={[UserRole.DOCTOR]}>
              <DoctorDashboard />
            </ProtectedRoute>
          } />

          <Route path="/patient" element={
            <ProtectedRoute user={user} allowedRoles={[UserRole.PATIENT]}>
              <PatientDashboard />
            </ProtectedRoute>
          } />

          <Route path="/book/:doctorId" element={
            <ProtectedRoute user={user} allowedRoles={[UserRole.PATIENT]}>
              <DoctorBooking />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  </AuthProvider>
);

export default App;
