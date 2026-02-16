
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, UserRole, Consultation } from '../../types.ts';
import { db } from '../../services/databaseService.ts';
import { Search, MapPin, Star, Calendar, Clock, CreditCard, ChevronLeft, ArrowRight } from 'lucide-react';

const DoctorBooking: React.FC<{ user: User }> = ({ user }) => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  
  const [doctors, setDoctors] = useState<User[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<User | null>(null);
  const [selectedDate, setSelectedDate] = useState('Wed, 25 Oct');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingStep, setBookingStep] = useState<'search' | 'slot' | 'payment'>('search');

  useEffect(() => {
    const activeDoctors = db.getDoctors();
    setDoctors(activeDoctors);

    if (doctorId && doctorId !== 'search') {
      const doc = activeDoctors.find(d => d.id === doctorId);
      if (doc) {
        setSelectedDoctor(doc);
        setBookingStep('slot');
      }
    }
  }, [doctorId]);

  const slots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

  const handlePay = () => {
    if (!selectedDoctor || !selectedSlot) return;

    const newBooking: Consultation = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: user.id,
      doctorId: selectedDoctor.id,
      date: selectedDate,
      slot: selectedSlot,
      status: 'confirmed',
      meetLink: 'https://meet.google.com/abc-defg-hij'
    };

    db.saveBooking(newBooking);
    alert("Consultation confirmed and saved to your history.");
    navigate('/patient');
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      {bookingStep === 'search' && (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Available Specialists</h1>
              <p className="text-slate-500 mt-1">Book your consultation with our verified medical network.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map(doc => (
              <div key={doc.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-blue-400 transition-all group hover:shadow-xl hover:shadow-blue-50/50">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-xl font-bold group-hover:scale-110 transition-transform shadow-inner">
                    {doc.avatar || doc.name[0]}
                  </div>
                  <div className="flex items-center space-x-1 text-amber-500 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold border border-amber-100">
                    <Star size={12} fill="currentColor" />
                    <span>4.9</span>
                  </div>
                </div>
                <h3 className="font-bold text-xl text-slate-900 group-hover:text-blue-700 transition-colors">{doc.name}</h3>
                <p className="text-sm font-semibold text-slate-500 mt-1">Medical Specialist</p>
                
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Consultation</span>
                    <span className="text-2xl font-bold text-slate-900">$50</span>
                  </div>
                  <button 
                    onClick={() => { setSelectedDoctor(doc); setBookingStep('slot'); }}
                    className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
                  >
                    <span>Book Session</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
            {doctors.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active doctors found in database</p>
              </div>
            )}
          </div>
        </div>
      )}

      {bookingStep === 'slot' && selectedDoctor && (
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 max-w-3xl mx-auto animate-in slide-in-from-right-4 duration-300">
          <button onClick={() => setBookingStep('search')} className="text-slate-500 hover:text-blue-600 mb-8 flex items-center text-sm font-bold transition-colors group">
            <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Search
          </button>
          
          <div className="flex items-center space-x-6 mb-10 pb-8 border-b border-slate-50">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 text-2xl font-bold">
              {selectedDoctor.avatar || selectedDoctor.name[0]}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{selectedDoctor.name}</h2>
              <p className="text-slate-500 font-medium">Verified Practitioner • $50/session</p>
            </div>
          </div>

          <div className="mb-10">
            <label className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center mb-6">
              <Calendar size={18} className="mr-2 text-blue-600" /> Choose Date
            </label>
            <div className="flex space-x-3 overflow-x-auto pb-4">
              {['Mon, 23 Oct', 'Tue, 24 Oct', 'Wed, 25 Oct', 'Thu, 26 Oct'].map(date => (
                <button 
                  key={date}
                  className={`px-6 py-4 rounded-2xl text-sm font-bold border-2 whitespace-nowrap transition-all ${selectedDate === date ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-100'}`}
                  onClick={() => setSelectedDate(date)}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <label className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center mb-6">
              <Clock size={18} className="mr-2 text-blue-600" /> Available Slots
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {slots.map(slot => (
                <button 
                  key={slot}
                  className={`py-4 rounded-2xl text-sm font-bold border-2 transition-all ${selectedSlot === slot ? 'bg-blue-50 text-blue-700 border-blue-600' : 'bg-white text-slate-600 border-slate-100 hover:border-blue-200'}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <button 
            disabled={!selectedSlot}
            onClick={() => setBookingStep('payment')}
            className="w-full py-5 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>Review & Payment</span>
            <ArrowRight size={20} />
          </button>
        </div>
      )}

      {bookingStep === 'payment' && selectedDoctor && (
        <div className="max-w-md mx-auto bg-white p-10 rounded-3xl shadow-xl border border-slate-50 text-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CreditCard size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-10">Checkout</h2>

          <div className="bg-slate-50/80 p-6 rounded-2xl mb-10 space-y-4 text-left border border-slate-100">
            <div className="flex justify-between items-center"><span className="text-slate-500 text-xs font-bold uppercase">Provider</span><span className="font-bold text-slate-900">{selectedDoctor.name}</span></div>
            <div className="flex justify-between items-center"><span className="text-slate-500 text-xs font-bold uppercase">Time</span><span className="font-bold text-slate-900">{selectedSlot}</span></div>
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center"><span className="text-slate-900 font-bold uppercase text-xs">Total</span><span className="text-blue-600 font-black text-2xl">$50</span></div>
          </div>

          <button onClick={handlePay} className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-3 hover:bg-slate-900 shadow-lg transition-all active:scale-95">
            <img src="https://www.gstatic.com/instantbuy/svg/googlepay_white_logo.svg" alt="GPay" className="h-6" />
            <span>Confirm with GPay</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorBooking;
