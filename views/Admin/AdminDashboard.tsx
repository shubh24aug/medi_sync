
import React, { useState } from 'react';

const AdminDashboard: React.FC = () => {
  const [pendingDoctors, setPendingDoctors] = useState([
    { id: '1', name: 'Dr. James Wilson', email: 'james.wilson@med.com', license: 'MD-12938-GA', specialty: 'General Physician' },
    { id: '2', name: 'Dr. Lisa Ray', email: 'lisa.ray@gmail.com', license: 'MD-88210-NY', specialty: 'Cardiologist' },
  ]);

  const handleApprove = (id: string) => {
    alert("Doctor approved! Notification sent to their device and email.");
    setPendingDoctors(pendingDoctors.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Admin Command Center</h1>
        <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
          {pendingDoctors.length} Pending Verifications
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-slate-600">Doctor</th>
              <th className="px-6 py-4 text-sm font-bold text-slate-600">License ID</th>
              <th className="px-6 py-4 text-sm font-bold text-slate-600">Specialty</th>
              <th className="px-6 py-4 text-sm font-bold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pendingDoctors.map(doc => (
              <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{doc.name}</div>
                  <div className="text-xs text-slate-500">{doc.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 font-mono">{doc.license}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                    {doc.specialty}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button 
                    onClick={() => handleApprove(doc.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all"
                  >
                    Approve
                  </button>
                  <button className="px-4 py-2 text-slate-400 hover:text-red-500 text-sm font-bold transition-all">
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {pendingDoctors.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                  All doctors are verified! No pending applications.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
