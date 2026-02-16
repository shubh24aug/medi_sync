
import React, { useState, useEffect } from 'react';
import { db } from '../../services/databaseService.ts';
import { User, UserRole } from '../../types.ts';

const AdminDashboard: React.FC = () => {
  const [pendingDoctors, setPendingDoctors] = useState<User[]>([]);

  useEffect(() => {
    // Fetch users with role DOCTOR and profileActive false
    const users = db.getUsers().filter(u => u.role === UserRole.DOCTOR && !u.profileActive);
    setPendingDoctors(users);
  }, []);

  const handleApprove = (id: string) => {
    db.updateDoctorStatus(id, true);
    setPendingDoctors(prev => prev.filter(d => d.id !== id));
    alert("Doctor approved! They can now access the Doctor Console.");
  };

  const handleReject = (id: string) => {
    // In a real app we'd delete or flag as rejected
    setPendingDoctors(prev => prev.filter(d => d.id !== id));
    alert("Application rejected.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Command Center</h1>
          <p className="text-slate-500 mt-1">Review and verify medical practitioners entering the network.</p>
        </div>
        <div className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-blue-100">
          {pendingDoctors.length} Pending Verifications
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Practitioner</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Credentials</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pendingDoctors.map(doc => (
              <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold shadow-sm">
                      {doc.avatar || doc.name[0]}
                    </div>
                    <div className="font-bold text-slate-900">{doc.name}</div>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm text-slate-500 font-medium">{doc.email}</td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                    License Pending
                  </span>
                </td>
                <td className="px-8 py-6 text-right space-x-3">
                  <button 
                    onClick={() => handleApprove(doc.id)}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleReject(doc.id)}
                    className="px-5 py-2.5 text-slate-400 hover:text-red-500 text-xs font-bold transition-all"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {pendingDoctors.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center">
                  <div className="max-w-xs mx-auto">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <p className="text-slate-500 font-bold">All caught up!</p>
                    <p className="text-xs text-slate-400 mt-1">No pending medical licenses require your attention right now.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-slate-900 rounded-[32px] text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Total Doctors</p>
          <p className="text-4xl font-bold">{db.getUsers().filter(u => u.role === UserRole.DOCTOR).length}</p>
        </div>
        <div className="p-8 bg-blue-600 rounded-[32px] text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-2">Verified Patients</p>
          <p className="text-4xl font-bold">{db.getUsers().filter(u => u.role === UserRole.PATIENT).length}</p>
        </div>
        <div className="p-8 bg-white border border-slate-100 rounded-[32px]">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Avg. Verification Time</p>
          <p className="text-4xl font-bold text-slate-900">14h</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
