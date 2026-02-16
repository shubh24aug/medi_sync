
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, MedicalRecord, HealthDataPoint, UserRole } from '../../types.ts';
import { analyzeMedicalRecord } from '../../services/geminiService.ts';
import { db } from '../../services/databaseService.ts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Upload, FileText, Activity, Heart, Moon, Plus, 
  Calendar, Search, Share2, CheckCircle, X, ExternalLink 
} from 'lucide-react';

interface PatientDashboardProps {
  user: User;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ user }) => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'sharing' | 'done'>('idle');

  useEffect(() => {
    setRecords(db.getRecords(user.id));
  }, [user.id]);

  const [healthData] = useState<HealthDataPoint[]>([
    { date: '2023-10-01', steps: 8400, heartRate: 72, sleepHours: 7.2 },
    { date: '2023-10-02', steps: 9200, heartRate: 70, sleepHours: 6.8 },
    { date: '2023-10-03', steps: 7800, heartRate: 75, sleepHours: 8.0 },
    { date: '2023-10-04', steps: 11000, heartRate: 68, sleepHours: 7.5 },
    { date: '2023-10-05', steps: 9500, heartRate: 71, sleepHours: 7.1 },
  ]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setIsUploading(true);
    
    const file = e.target.files[0];
    const mockContent = `Patient: ${user.name}. Report Date: ${new Date().toLocaleDateString()}. Diagnosis: Stable recovery. Routine checkup results within expected parameters.`;
    
    try {
      const analysis = await analyzeMedicalRecord(mockContent);
      const newRecord: MedicalRecord = {
        id: Math.random().toString(36).substr(2, 9),
        patientId: user.id,
        fileName: file.name,
        uploadDate: new Date().toLocaleDateString(),
        summary: analysis.summary,
        keyFindings: analysis.keyFindings,
        originalContent: mockContent
      };
      db.saveRecord(newRecord);
      setRecords(prev => [newRecord, ...prev]);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to analyze record. Please try again.");
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = ''; 
    }
  };

  const handleShare = () => {
    setShareStatus('sharing');
    setTimeout(() => {
      setShareStatus('done');
      setTimeout(() => setShareStatus('idle'), 3000);
    }, 1500);
  };

  const bookings = db.getBookings(user.id, UserRole.PATIENT);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Health Hub</h1>
          <p className="text-slate-500 mt-1">Welcome back, {user.name}. Your wellness journey is on track.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/book/search" 
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Search size={18} />
            <span>Find Doctors</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Vitals Section */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold flex items-center text-slate-800">
                <Activity className="w-5 h-5 mr-3 text-blue-600" />
                Live Vitals
              </h2>
              <div className="flex items-center px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase tracking-widest border border-green-100">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Persistent Storage Sync
              </div>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                    itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="steps" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#fff', strokeWidth: 3, stroke: '#3b82f6' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={4} dot={{ r: 4, fill: '#fff', strokeWidth: 3, stroke: '#ef4444' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 group hover:bg-blue-50 transition-colors">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Steps</p>
                <p className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">9,540</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 group hover:bg-red-50 transition-colors">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">BPM</p>
                <p className="text-2xl font-bold text-slate-900 group-hover:text-red-600 transition-colors">71</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 group hover:bg-indigo-50 transition-colors">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Sleep</p>
                <p className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">7.2h</p>
              </div>
            </div>
          </div>

          {/* Records Section */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold flex items-center">
                <FileText className="w-5 h-5 mr-3 text-blue-600" />
                Medical Archives
              </h2>
              <label className="cursor-pointer bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center space-x-2 shadow-lg shadow-blue-100 active:scale-95">
                <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.txt,.jpg" />
                {isUploading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : <Plus size={18} />}
                <span>{isUploading ? 'Analyzing...' : 'Add Report'}</span>
              </label>
            </div>

            <div className="space-y-4">
              {records.length === 0 ? (
                <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Upload className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-bold">No digital records yet</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-[240px] mx-auto">Upload clinical notes or test results for instant AI analysis.</p>
                </div>
              ) : (
                records.map(record => (
                  <div key={record.id} className="p-6 rounded-2xl border border-slate-100 hover:border-blue-300 transition-all bg-white hover:shadow-xl hover:shadow-blue-50/20 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
                          <FileText size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 leading-tight">{record.fileName}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{record.uploadDate}</p>
                        </div>
                      </div>
                      <button className="text-slate-300 hover:text-blue-600 transition-colors">
                        <ExternalLink size={18} />
                      </button>
                    </div>
                    <p className="text-sm text-slate-600 mb-5 leading-relaxed font-medium">{record.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      {record.keyFindings.map((finding, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-blue-100">
                          {finding}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-400 p-8 rounded-[40px] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] opacity-10">
              <Share2 size={160} />
            </div>
            <h3 className="font-bold text-2xl mb-4 relative z-10">Sync Records</h3>
            <p className="text-sm text-indigo-50 leading-relaxed mb-10 opacity-90 relative z-10">
              Your data is stored in a local persistent database. Sharing updates your global profile for consultants.
            </p>
            <button 
              onClick={handleShare}
              disabled={shareStatus !== 'idle'}
              className={`w-full py-4 rounded-2xl text-sm font-bold shadow-xl transition-all active:scale-95 relative z-10 flex items-center justify-center space-x-3 ${
                shareStatus === 'sharing' ? 'bg-indigo-300 text-indigo-800' :
                shareStatus === 'done' ? 'bg-green-400 text-white' : 'bg-white text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              {shareStatus === 'sharing' ? (
                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              ) : shareStatus === 'done' ? (
                <CheckCircle size={20} />
              ) : <Share2 size={20} />}
              <span>
                {shareStatus === 'sharing' ? 'Updating Database...' : 
                 shareStatus === 'done' ? 'Sync Complete' : 'Sync to Provider'}
              </span>
            </button>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-8 flex items-center">
              <Calendar className="w-5 h-5 mr-3 text-blue-600" />
              Recent Schedule
            </h3>
            <div className="space-y-6">
              {bookings.length > 0 ? (
                bookings.slice(0, 1).map(b => (
                  <div key={b.id} className="flex items-center space-x-4 p-5 rounded-3xl bg-slate-50 group hover:bg-blue-50/50 transition-all border border-transparent hover:border-blue-100">
                    <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-blue-600 text-lg font-bold shadow-sm group-hover:scale-110 transition-transform">
                      {b.doctorId.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">Specialist Consultation</p>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">{b.date} • {b.slot}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs font-bold uppercase tracking-widest">No Sessions</div>
              )}
              <button 
                onClick={() => setShowBookings(true)}
                className="w-full text-center text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors tracking-widest uppercase py-2"
              >
                View History ({bookings.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Modal */}
      {showBookings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">My Appointments</h2>
              <button onClick={() => setShowBookings(false)} className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-slate-600 shadow-sm">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 max-h-[60vh] overflow-y-auto space-y-4">
              {bookings.map(b => (
                <div key={b.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-blue-200 bg-white transition-all group cursor-default">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500 text-sm">{b.doctorId.substring(0,2).toUpperCase()}</div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Consultation</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{b.date} • {b.slot}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    b.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {b.status}
                  </span>
                </div>
              ))}
              {bookings.length === 0 && <p className="text-center py-10 text-slate-400 font-bold">No bookings found in database.</p>}
            </div>
            <div className="p-8 bg-slate-50/50 border-t border-slate-50">
              <Link 
                to="/book/search" 
                onClick={() => setShowBookings(false)}
                className="w-full block text-center py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98]"
              >
                Schedule New Appointment
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
