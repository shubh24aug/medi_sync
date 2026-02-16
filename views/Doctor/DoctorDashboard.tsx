
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { UserRole, Consultation } from '../../types.ts';
import { translateText } from '../../services/geminiService.ts';
import { db } from '../../services/databaseService.ts';
import { Calendar, Users, Video, Clock, FileText, Languages, Save, AlertCircle } from 'lucide-react';

// --- Dashboard Modules ---

const ScheduleView: React.FC<{ bookings: Consultation[], onEnterRoom: () => void }> = ({ bookings, onEnterRoom }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold mb-8 flex items-center text-slate-800">
        <Clock className="w-5 h-5 mr-3 text-blue-600" />
        Practitioner Schedule
      </h2>
      <div className="space-y-4">
        {bookings.length > 0 ? (
          bookings.map(apt => (
            <div key={apt.id} className="group flex items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-blue-300 bg-white transition-all cursor-pointer">
              <div className="flex items-center space-x-5">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center font-bold text-lg">{apt.patientId.substring(0,1).toUpperCase()}</div>
                <div>
                  <h4 className="font-bold text-slate-900">Patient Case {apt.patientId.substring(0,4)}</h4>
                  <p className="text-xs text-slate-500 font-medium">{apt.date} • {apt.slot}</p>
                </div>
              </div>
              <button onClick={onEnterRoom} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                Enter Room
              </button>
            </div>
          ))
        ) : <p className="py-20 text-center text-slate-400 font-bold">No sessions scheduled.</p>}
      </div>
    </div>
    <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-xl flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-4">Cloud Intelligence</h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-8">AI-powered predictive health insights are currently syncing with your practice vault.</p>
      </div>
      <button className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold transition-all uppercase tracking-widest border border-white/20">
        Configure AI Assistant
      </button>
    </div>
  </div>
);

const ConsultationRoom: React.FC = () => {
  const [notes, setNotes] = useState("");
  const [translation, setTranslation] = useState("");
  const [lang, setLang] = useState("Spanish");
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!notes) return;
    setLoading(true);
    try {
      setTranslation(await translateText(notes, lang));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-slate-800 flex items-center"><Users className="w-5 h-5 mr-3 text-blue-600" /> Active Session</h2>
          <div className="flex items-center px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-full border border-red-100 animate-pulse">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>Live Session
          </div>
        </div>
        <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-start space-x-4">
          <AlertCircle className="text-blue-600 mt-0.5" size={20} />
          <p className="text-sm text-slate-700 leading-relaxed font-medium">Patient medical history synchronized. AI suggests monitoring glucose levels based on recent report uploads.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6 flex flex-col">
        <h2 className="text-xl font-bold text-slate-800 flex items-center"><FileText className="w-5 h-5 mr-3 text-blue-600" /> Diagnostic Notes</h2>
        <textarea 
          className="w-full flex-1 min-h-[250px] p-6 border border-slate-100 rounded-[32px] bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none resize-none transition-all text-slate-700 font-medium"
          placeholder="Record consultation details..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className="flex space-x-4">
          <select className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none" value={lang} onChange={(e) => setLang(e.target.value)}>
            <option>Spanish</option><option>French</option><option>German</option><option>Hindi</option>
          </select>
          <button onClick={handleTranslate} disabled={loading || !notes} className="flex items-center space-x-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all disabled:opacity-50">
            {loading ? <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div> : <Languages size={18} />}
            <span>Translate</span>
          </button>
        </div>
        {translation && <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 text-sm italic text-slate-700">"{translation}"</div>}
        <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 flex items-center justify-center space-x-3 active:scale-95 transition-all">
          <Save size={20} /><span>Save & End Session</span>
        </button>
      </div>
    </div>
  );
};

// --- Parent Dashboard ---

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'schedule' | 'patients'>('schedule');

  if (!user?.profileActive) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center bg-white p-12 rounded-[40px] shadow-xl border border-blue-50">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse"><Clock size={40} /></div>
        <h1 className="text-2xl font-bold mb-4 text-slate-900">Application Review</h1>
        <p className="text-slate-500 mb-8 leading-relaxed font-medium">Your medical credentials are being verified by our administrative team. Verification typically takes 12-24 hours.</p>
        <div className="bg-slate-50 p-6 rounded-2xl text-xs text-left border border-slate-100 text-slate-600 space-y-2">
          <p className="font-bold text-slate-900 uppercase tracking-widest text-[10px]">Testing Instructions:</p>
          <p>1. Login as <b>admin@example.com</b> (password: admin)</p>
          <p>2. Approve your profile from the Command Center.</p>
        </div>
      </div>
    );
  }

  const bookings = db.getBookings(user.id, UserRole.DOCTOR);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Practitioner Console</h1>
          <div className="flex items-center text-slate-500 mt-1 font-medium"><div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>Verified Professional • {user.name}</div>
        </div>
        <div className="flex bg-white rounded-2xl shadow-sm border border-slate-200 p-1.5 self-start">
          <button onClick={() => setTab('schedule')} className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === 'schedule' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Calendar size={18} /><span>Schedule</span>
          </button>
          <button onClick={() => setTab('patients')} className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === 'patients' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Video size={18} /><span>Room</span>
          </button>
        </div>
      </div>
      {tab === 'schedule' ? <ScheduleView bookings={bookings} onEnterRoom={() => setTab('patients')} /> : <ConsultationRoom />}
    </div>
  );
};

export default DoctorDashboard;
