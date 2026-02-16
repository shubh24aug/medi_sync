import React, { useState } from 'react';
import { User } from '../../types.ts';
import { translateText } from '../../services/geminiService.ts';
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

  if (!user.profileActive) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center bg-white p-12 rounded-3xl shadow-xl border border-blue-50">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-8 animate-pulse">
          <Clock size={40} />
        </div>
        <h1 className="text-2xl font-bold mb-4 text-slate-900">Verification Pending</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Our specialized team is currently verifying your medical credentials. You'll receive a real-time notification on your connected devices once your profile is active.
        </p>
        <div className="bg-slate-50 p-6 rounded-2xl text-xs text-left border border-slate-100">
          <h4 className="font-bold text-slate-700 mb-3 uppercase tracking-wider">Verification Checklist</h4>
          <ul className="space-y-3">
            <li className="flex items-center text-slate-600">
              <CheckCircle size={14} className="text-green-500 mr-2" />
              Document Submission
            </li>
            <li className="flex items-center text-slate-600">
              <AlertCircle size={14} className="text-amber-500 mr-2" />
              License Verification (In Progress)
            </li>
            <li className="flex items-center text-slate-600 italic">
              <Clock size={14} className="text-slate-400 mr-2" />
              Profile Activation
            </li>
          </ul>
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Doctor's Console</h1>
          <p className="text-slate-500 mt-1 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Online and active • {user.name}
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
              Upcoming Appointments
            </h2>
            <div className="space-y-4">
              {[
                { name: 'John Doe', time: '10:30 AM', type: 'Follow-up', id: '1', initial: 'JD' },
                { name: 'Alice Wong', time: '11:15 AM', type: 'General Check', id: '2', initial: 'AW' },
                { name: 'Robert Fox', time: '01:00 PM', type: 'Cardio Review', id: '3', initial: 'RF' },
              ].map(apt => (
                <div key={apt.id} className="group flex items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-blue-300 bg-white hover:bg-slate-50/50 transition-all cursor-pointer">
                  <div className="flex items-center space-x-5">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                      {apt.initial}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{apt.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{apt.type} • {apt.time}</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => setActiveTab('patients')}
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                    >
                      Enter Room
                    </button>
                    <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                      <Calendar size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100">
              <h2 className="text-xl font-bold mb-4">Calendar Sync</h2>
              <p className="text-sm text-indigo-50 leading-relaxed mb-8 opacity-90">
                Your practice hours are automatically synced with Google Calendar. Patients can see your real-time availability.
              </p>
              <button className="w-full py-3.5 bg-white text-indigo-600 rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-50 transition-all active:scale-95">
                Update Availability
              </button>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-blue-600" />
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Patients</p>
                  <p className="text-2xl font-bold text-slate-800">248</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Today</p>
                  <p className="text-2xl font-bold text-slate-800">8</p>
                </div>
              </div>
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
                  Active: John Doe
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
                    "Patient history shows a tendency for hypertension. Recent vitals indicate a 5% increase in resting heart rate over the last 48 hours. Suggest monitoring sodium intake."
                  </p>
                </div>
                
                <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                  <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Medical Record Analysis</span>
                    <button className="text-blue-600 text-[10px] font-bold hover:underline tracking-widest uppercase">View PDF</button>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">Analysis of Blood_Work_Oct.pdf: "Elevated cortisol levels (22 μg/dL). Glucose and Lipid profile within standard ranges."</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-lg uppercase tracking-wide">High Cortisol</span>
                      <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg uppercase tracking-wide">Stable Glucose</span>
                    </div>
                  </div>
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