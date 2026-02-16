
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types.ts';
import { translateText } from '../../services/geminiService.ts';
import { db } from '../../services/databaseService.ts';
import { 
  Calendar, 
  Users, 
  Video, 
  Clock, 
  FileText, 
  Languages, 
  Save, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface DoctorDashboardProps {
  user: User;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'patients'>('schedule');
  const [consultationNotes, setConsultationNotes] = useState("");
  const [translatedNotes, setTranslatedNotes] = useState("");
  const [selectedLang, setSelectedLang] = useState("Spanish");
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    // Refresh user data from DB to check for approval updates
    const updatedUser = db.getUserByEmail(user.email);
    if (updatedUser) setCurrentUser(updatedUser);
  }, [user.email]);

  if (!currentUser.profileActive) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center bg-white p-12 rounded-3xl shadow-xl border border-blue-50">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-8 animate-pulse">
          <Clock size={40} />
        </div>
        <h1 className="text-2xl font-bold mb-4 text-slate-900">Verification Pending</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Logged in as <b>{currentUser.name}</b>. Your medical credentials are currently being reviewed by our Admin team.
        </p>
        <div className="bg-slate-50 p-6 rounded-2xl text-xs text-left border border-slate-100">
          <h4 className="font-bold text-slate-700 mb-3 uppercase tracking-wider">How to test the flow:</h4>
          <ol className="space-y-3 list-decimal ml-4 text-slate-600">
            <li>Logout from this account.</li>
            <li>Login as <b>Admin</b> (select Admin role or use admin@example.com).</li>
            <li>In Admin Dashboard, find your name and click <b>Approve</b>.</li>
            <li>Login back to this Doctor account.</li>
          </ol>
        </div>
      </div>
    );
  }

  const handleTranslate = async () => {
    if (!consultationNotes) return;
    setIsTranslating(true);
    try {
      const translated = await translateText(consultationNotes, selectedLang);
      setTranslatedNotes(translated);
    } finally {
      setIsTranslating(false);
    }
  };

  const bookings = db.getBookings(currentUser.id, UserRole.DOCTOR);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Doctor's Console</h1>
          <p className="text-slate-500 mt-1 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Verified practitioner • {currentUser.name}
          </p>
        </div>
        <div className="flex bg-white rounded-2xl shadow-sm border border-slate-200 p-1.5 self-start">
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'schedule' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Calendar size={18} />
            <span>Schedule</span>
          </button>
          <button 
            onClick={() => setActiveTab('patients')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'patients' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Video size={18} />
            <span>Live Session</span>
          </button>
        </div>
      </div>

      {activeTab === 'schedule' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold mb-8 flex items-center text-slate-800">
              <Clock className="w-5 h-5 mr-3 text-blue-600" />
              Patient Schedule
            </h2>
            <div className="space-y-4">
              {bookings.length > 0 ? (
                bookings.map(apt => (
                  <div key={apt.id} className="group flex items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-blue-300 bg-white hover:bg-slate-50/50 transition-all cursor-pointer">
                    <div className="flex items-center space-x-5">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                        {apt.patientId.substring(0,1).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">Consultation</h4>
                        <p className="text-xs text-slate-500 font-medium">{apt.date} • {apt.slot}</p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => setActiveTab('patients')}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                      >
                        Enter Room
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center">
                  <p className="text-slate-400 font-bold">No appointments scheduled today.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100">
              <h2 className="text-xl font-bold mb-4">Database Sync</h2>
              <p className="text-sm text-indigo-50 leading-relaxed mb-8 opacity-90">
                Connected to MediSync Cloud Storage. All patient interactions are encrypted and persistently stored.
              </p>
              <button className="w-full py-3.5 bg-white text-indigo-600 rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-50 transition-all active:scale-95">
                Practice Settings
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-800 flex items-center">
                  <Users className="w-5 h-5 mr-3 text-blue-600" />
                  Active: Patient Consultation
                </h2>
                <div className="flex items-center px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-full border border-red-100">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-ping"></div>
                  Live Call
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl">
                  <h4 className="text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-3 flex items-center">
                    <AlertCircle size={14} className="mr-2" />
                    AI Health Intelligence
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    "Syncing records with persistent database... AI analyzing historical trends from patient vault. Summary will appear shortly."
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6 flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 flex items-center">
                <FileText className="w-5 h-5 mr-3 text-blue-600" />
                Prescription & Notes
              </h2>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Autosaved just now</div>
            </div>
            
            <textarea 
              className="w-full flex-1 min-h-[250px] p-6 border border-slate-200 rounded-3xl focus:ring-4 focus:ring-blue-50 outline-none resize-none transition-all text-slate-700 leading-relaxed placeholder:text-slate-300"
              placeholder="Record your diagnosis, prescribed medication, and lifestyle recommendations..."
              value={consultationNotes}
              onChange={(e) => setConsultationNotes(e.target.value)}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 bg-slate-50 rounded-2xl p-2 border border-slate-100">
                <Languages size={18} className="ml-2 text-slate-400" />
                <select 
                  className="flex-1 px-2 py-2 bg-transparent text-sm font-semibold text-slate-700 outline-none"
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                >
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Hindi</option>
                  <option>Japanese</option>
                </select>
              </div>
              <button 
                onClick={handleTranslate}
                disabled={isTranslating || !consultationNotes}
                className="py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isTranslating ? (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                ) : <Languages size={18} />}
                <span>Google Translate</span>
              </button>
            </div>

            {translatedNotes && (
              <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 animate-in slide-in-from-top-2">
                <h4 className="text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-2">Patient Translation ({selectedLang})</h4>
                <p className="text-sm text-slate-700 italic leading-relaxed">"{translatedNotes}"</p>
              </div>
            )}

            <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center space-x-3 active:scale-[0.98]">
              <Save size={20} />
              <span>Finalize & Sync Records</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
