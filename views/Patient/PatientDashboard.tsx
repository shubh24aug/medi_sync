
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { MedicalRecord, HealthDataPoint, UserRole } from '../../types.ts';
import { analyzeMedicalRecord } from '../../services/geminiService.ts';
import { db } from '../../services/databaseService.ts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Upload, FileText, Activity, Plus, 
  Calendar, Search, Share2, CheckCircle, X, ExternalLink 
} from 'lucide-react';

// --- Sub-Components ---

const VitalStats: React.FC<{ data: HealthDataPoint[] }> = ({ data }) => (
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-xl font-bold flex items-center text-slate-800">
        <Activity className="w-5 h-5 mr-3 text-blue-600" />
        Live Health Vitals
      </h2>
      <div className="flex items-center px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase tracking-widest border border-green-100">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></div>
        Encrypted Sync Active
      </div>
    </div>
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="date" hide />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
            itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
          />
          <Line type="monotone" dataKey="steps" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#fff', strokeWidth: 3, stroke: '#3b82f6' }} />
          <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={4} dot={{ r: 4, fill: '#fff', strokeWidth: 3, stroke: '#ef4444' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <div className="grid grid-cols-3 gap-4 mt-8">
      {[
        { label: 'Steps', val: '9,540', color: 'blue' },
        { label: 'BPM', val: '71', color: 'red' },
        { label: 'Sleep', val: '7.2h', color: 'indigo' }
      ].map((vital) => (
        <div key={vital.label} className={`bg-slate-50 p-5 rounded-2xl border border-slate-100 group hover:bg-${vital.color}-50 transition-colors`}>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{vital.label}</p>
          <p className={`text-2xl font-bold text-slate-900 group-hover:text-${vital.color}-600`}>{vital.val}</p>
        </div>
      ))}
    </div>
  </div>
);

const RecordCard: React.FC<{ record: MedicalRecord }> = ({ record }) => (
  <div className="p-6 rounded-2xl border border-slate-100 hover:border-blue-300 transition-all bg-white hover:shadow-xl hover:shadow-blue-50/20 group">
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
);

// --- Main Component ---

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'sharing' | 'done'>('idle');

  useEffect(() => {
    if (user) setRecords(db.getRecords(user.id));
  }, [user]);

  const healthData: HealthDataPoint[] = [
    { date: '2023-10-01', steps: 8400, heartRate: 72, sleepHours: 7.2 },
    { date: '2023-10-02', steps: 9200, heartRate: 70, sleepHours: 6.8 },
    { date: '2023-10-03', steps: 7800, heartRate: 75, sleepHours: 8.0 },
    { date: '2023-10-04', steps: 11000, heartRate: 68, sleepHours: 7.5 },
    { date: '2023-10-05', steps: 9500, heartRate: 71, sleepHours: 7.1 },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !user) return;
    setIsUploading(true);
    
    const file = e.target.files[0];
    const mockContent = `Report for ${user.name}. Date: ${new Date().toDateString()}. Findings: Patient exhibits optimal vitals. Respiratory function stable. No acute abnormalities noted.`;
    
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
    } finally {
      setIsUploading(false);
    }
  };

  const handleSync = () => {
    setShareStatus('sharing');
    setTimeout(() => {
      setShareStatus('done');
      setTimeout(() => setShareStatus('idle'), 3000);
    }, 1500);
  };

  const bookings = user ? db.getBookings(user.id, UserRole.PATIENT) : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Patient Console</h1>
          <p className="text-slate-500 mt-1 font-medium">Monitoring health trends for {user?.name}.</p>
        </div>
        <Link to="/book/search" className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
          <Search size={18} />
          <span>Consult Specialist</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <VitalStats data={healthData} />

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold flex items-center">
                <FileText className="w-5 h-5 mr-3 text-blue-600" />
                Medical Archives
              </h2>
              <label className="cursor-pointer bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center space-x-2 shadow-lg shadow-blue-100 active:scale-95">
                <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.txt" />
                {isUploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Plus size={18} />}
                <span>{isUploading ? 'AI Analyzing...' : 'Add Report'}</span>
              </label>
            </div>

            <div className="space-y-4">
              {records.length > 0 ? (
                records.map(record => <RecordCard key={record.id} record={record} />)
              ) : (
                <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                  <Upload className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold">No digital records found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-400 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
            <Share2 className="absolute top-[-20%] right-[-10%] opacity-10" size={160} />
            <h3 className="font-bold text-2xl mb-4 relative z-10">Sync Profile</h3>
            <p className="text-sm text-indigo-50 leading-relaxed mb-10 opacity-90 relative z-10">
              Update your medical data across the MediSync provider network.
            </p>
            <button 
              onClick={handleSync}
              disabled={shareStatus !== 'idle'}
              className="w-full py-4 rounded-2xl text-sm font-bold shadow-xl transition-all active:scale-95 relative z-10 flex items-center justify-center space-x-3 bg-white text-indigo-600 hover:bg-indigo-50"
            >
              {shareStatus === 'sharing' ? <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div> :
               shareStatus === 'done' ? <CheckCircle size={20} /> : <Share2 size={20} />}
              <span>{shareStatus === 'sharing' ? 'Syncing...' : shareStatus === 'done' ? 'Success' : 'Global Sync'}</span>
            </button>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-8 flex items-center">
              <Calendar className="w-5 h-5 mr-3 text-blue-600" />
              Schedule
            </h3>
            <div className="space-y-6">
              {bookings.length > 0 ? (
                bookings.slice(0, 2).map(b => (
                  <div key={b.id} className="flex items-center space-x-4 p-5 rounded-3xl bg-slate-50 group hover:bg-blue-50/50 transition-all border border-transparent hover:border-blue-100">
                    <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold shadow-sm">
                      {b.doctorId.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Consultation</p>
                      <p className="text-xs text-slate-500 font-bold">{b.date} • {b.slot}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-300 text-xs font-bold uppercase tracking-widest">No Appointments</div>
              )}
              <button onClick={() => setShowBookings(true)} className="w-full text-center text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors uppercase py-2">
                Manage Sessions ({bookings.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {showBookings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">My Appointments</h2>
              <button onClick={() => setShowBookings(false)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"><X size={20} /></button>
            </div>
            <div className="p-8 max-h-[60vh] overflow-y-auto space-y-4">
              {bookings.map(b => (
                <div key={b.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white group transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500">{b.doctorId.substring(0,2).toUpperCase()}</div>
                    <div><p className="font-bold text-slate-900 text-sm">Consultation</p><p className="text-[10px] text-slate-500 font-bold">{b.date}</p></div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-green-100 text-green-700">{b.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
