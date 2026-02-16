
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { User, Consultation } from '../../types.ts';
import { db } from '../../services/databaseService.ts';
import { Star, Calendar, Clock, CreditCard, ChevronLeft, ArrowRight } from 'lucide-react';

const DoctorBooking: React.FC = () => {
  const { doctorId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [doctors, setDoctors] = useState<User[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<User | null>(null);
  const [selectedDate, setSelectedDate] = useState('Wed, 25 Oct');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [step, setStep] = useState<'search' | 'slot' | 'payment'>('search');

  useEffect(() => {
    const active = db.getDoctors();
    setDoctors(active);
    if (doctorId && doctorId !== 'search') {
      const doc = active.find(d => d.id === doctorId);
      if (doc) { setSelectedDoctor(doc); setStep('slot'); }
    }
  }, [doctorId]);

  const slots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'];

  const handlePay = () => {
    if (!selectedDoctor || !selectedSlot || !user) return;
    db.saveBooking({
      id: Math.random().toString(36).substr(2, 9),
      patientId: user.id,
      doctorId: selectedDoctor.id,
      date: selectedDate,
      slot: selectedSlot,
      status: 'confirmed',
      meetLink: 'https://meet.google.com/xyz'
    });
    alert("Appointment successfully booked.");
    navigate('/patient');
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      {step === 'search' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {doctors.map(doc => (
            <div key={doc.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 group hover:shadow-2xl transition-all">
              <div className="flex justify-between mb-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center font-bold text-xl">{doc.avatar || doc.name[0]}</div>
                <div className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold flex items-center h-fit"><Star size={12} className="mr-1" /> 4.9</div>
              </div>
              <h3 className="font-bold text-xl text-slate-900">{doc.name}</h3>
              <p className="text-sm font-semibold text-slate-400 mt-1">Medical Consultant</p>
              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div><p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Fee</p><p className="text-2xl font-bold">$50</p></div>
                <button onClick={() => { setSelectedDoctor(doc); setStep('slot'); }} className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all"><ArrowRight size={20} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {step === 'slot' && selectedDoctor && (
        <div className="max-w-2xl mx-auto bg-white p-10 rounded-[48px] shadow-sm border border-slate-100">
          <button onClick={() => setStep('search')} className="text-slate-400 hover:text-blue-600 flex items-center text-xs font-black uppercase tracking-widest mb-10"><ChevronLeft size={16} className="mr-1" /> Back</button>
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Select Appointment</h2>
            <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
              {['Mon, 23 Oct', 'Tue, 24 Oct', 'Wed, 25 Oct'].map(d => (
                <button key={d} onClick={() => setSelectedDate(d)} className={`px-6 py-4 rounded-2xl text-sm font-bold border-2 transition-all whitespace-nowrap ${selectedDate === d ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 border-transparent text-slate-500 hover:border-slate-200'}`}>{d}</button>
              ))}
            </div>
          </div>
          <div className="mb-12 grid grid-cols-2 md:grid-cols-3 gap-3">
            {slots.map(s => (
              <button key={s} onClick={() => setSelectedSlot(s)} className={`py-4 rounded-2xl text-sm font-bold border-2 transition-all ${selectedSlot === s ? 'bg-blue-50 text-blue-700 border-blue-600' : 'bg-slate-50 border-transparent text-slate-500 hover:border-slate-200'}`}>{s}</button>
            ))}
          </div>
          <button disabled={!selectedSlot} onClick={() => setStep('payment')} className="w-full py-5 bg-blue-600 text-white font-bold rounded-3xl shadow-xl shadow-blue-100 active:scale-95 transition-all disabled:opacity-50">Proceed to Payment</button>
        </div>
      )}

      {step === 'payment' && selectedDoctor && (
        <div className="max-w-md mx-auto bg-white p-10 rounded-[48px] shadow-2xl border border-slate-50 text-center">
          <CreditCard className="mx-auto mb-8 text-blue-600" size={48} />
          <h2 className="text-2xl font-bold mb-8">Checkout</h2>
          <div className="bg-slate-50 p-6 rounded-3xl mb-8 space-y-3 text-left">
            <div className="flex justify-between text-sm"><span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Doctor</span><span className="font-bold">{selectedDoctor.name}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Time</span><span className="font-bold">{selectedSlot}</span></div>
            <div className="pt-3 border-t border-slate-100 flex justify-between font-black text-blue-600 text-xl"><span>Total</span><span>$50.00</span></div>
          </div>
          <button onClick={handlePay} className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:opacity-90 active:scale-95 transition-all">
            <img src="https://www.gstatic.com/instantbuy/svg/googlepay_white_logo.svg" className="h-6" alt="GPay" /><span>Pay with GPay</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorBooking;
