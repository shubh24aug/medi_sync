
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User } from '../../types.ts';
import { Search, MapPin, Star, Calendar, Clock, CreditCard, ChevronLeft, ArrowRight } from 'lucide-react';

const MOCK_DOCTORS = [
  { id: '1', name: 'Dr. Sarah Smith', specialty: 'Cardiologist', rating: 4.9, cost: 80, avatar: 'SS', location: 'New York, NY' },
  { id: '2', name: 'Dr. Michael Chen', specialty: 'Neurologist', rating: 4.8, cost: 95, avatar: 'MC', location: 'San Francisco, CA' },
  { id: '3', name: 'Dr. Elena Rodriguez', specialty: 'Dermatologist', rating: 4.7, cost: 70, avatar: 'ER', location: 'Austin, TX' },
];

const DoctorBooking: React.FC<{ user: User }> = ({ user }) => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  
  const [selectedDoctor, setSelectedDoctor] = useState(MOCK_DOCTORS[0]);
  const [selectedDate, setSelectedDate] = useState('Wed, 25 Oct');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingStep, setBookingStep] = useState<'search' | 'slot' | 'payment'>('search');

  useEffect(() => {
    if (doctorId && doctorId !== 'search') {
      const doc = MOCK_DOCTORS.find(d => d.id === doctorId);
      if (doc) {
        setSelectedDoctor(doc);
        setBookingStep('slot');
      }
    } else {
      setBookingStep('search');
    }
  }, [doctorId]);

  const slots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '02:00 PM', '02:30 PM'];

  const handlePay = () => {
    alert("Payment Successful via Google Pay! Booking confirmed. A Google Meet link has been sent to your email and added to your Google Calendar.");
    navigate('/patient');
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      {bookingStep === 'search' && (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Select a Specialist</h1>
              <p className="text-slate-500 mt-1">Book your consultation with our world-class medical network.</p>
            </div>
            <div className="relative group min-w-[300px]">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Search size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Search specialty, name..." 
                className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition-all font-medium" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_DOCTORS.map(doc => (
              <div key={doc.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-blue-400 transition-all group hover:shadow-xl hover:shadow-blue-50/50">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-xl font-bold group-hover:scale-110 transition-transform shadow-inner">
                    {doc.avatar}
                  </div>
                  <div className="flex items-center space-x-1 text-amber-500 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold border border-amber-100">
                    <Star size={12} fill="currentColor" />
                    <span>{doc.rating}</span>
                  </div>
                </div>
                <h3 className="font-bold text-xl text-slate-900 group-hover:text-blue-700 transition-colors">{doc.name}</h3>
                <p className="text-sm font-semibold text-slate-500 mt-1">{doc.specialty}</p>
                
                <div className="mt-6 flex items-center text-slate-400 text-xs font-medium space-x-4">
                  <span className="flex items-center"><MapPin size={14} className="mr-1" /> {doc.location}</span>
                </div>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fee</span>
                    <span className="text-2xl font-bold text-slate-900">${doc.cost}</span>
                  </div>
                  <button 
                    onClick={() => { setSelectedDoctor(doc); setBookingStep('slot'); }}
                    className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
                  >
                    <span>Book Now</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {bookingStep === 'slot' && (
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 max-w-3xl mx-auto animate-in slide-in-from-right-4 duration-300">
          <button onClick={() => setBookingStep('search')} className="text-slate-500 hover:text-blue-600 mb-8 flex items-center text-sm font-bold transition-colors group">
            <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Specialists
          </button>
          
          <div className="flex items-center space-x-6 mb-10 pb-8 border-b border-slate-50">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 text-2xl font-bold shadow-inner">
              {selectedDoctor.avatar}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{selectedDoctor.name}</h2>
              <p className="text-slate-500 font-medium flex items-center mt-1">
                <Star size={14} className="text-amber-500 mr-1" fill="currentColor" />
                {selectedDoctor.specialty} • ${selectedDoctor.cost}/session
              </p>
            </div>
          </div>

          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <label className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center">
                <Calendar size={18} className="mr-2 text-blue-600" />
                Choose Date
              </label>
            </div>
            <div className="flex space-x-3 overflow-x-auto pb-4 hide-scrollbar">
              {['Mon, 23 Oct', 'Tue, 24 Oct', 'Wed, 25 Oct', 'Thu, 26 Oct', 'Fri, 27 Oct'].map(date => (
                <button 
                  key={date}
                  className={`px-6 py-4 rounded-2xl text-sm font-bold border-2 whitespace-nowrap transition-all ${selectedDate === date ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100' : 'bg-white text-slate-600 border-slate-100 hover:border-blue-200'}`}
                  onClick={() => setSelectedDate(date)}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <label className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center">
                <Clock size={18} className="mr-2 text-blue-600" />
                Available Slots
              </label>
            </div>
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
            className="w-full py-5 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] text-lg flex items-center justify-center space-x-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={20} />
          </button>
        </div>
      )}

      {bookingStep === 'payment' && (
        <div className="max-w-md mx-auto bg-white p-10 rounded-3xl shadow-xl border border-slate-50 text-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CreditCard size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Review & Pay</h2>
          <p className="text-slate-500 text-sm mb-10">Secure payment powered by Google Pay</p>

          <div className="bg-slate-50/80 p-6 rounded-2xl mb-10 space-y-4 text-left border border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm font-medium">Provider</span>
              <span className="font-bold text-slate-900">{selectedDoctor.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm font-medium">Schedule</span>
              <span className="font-bold text-slate-900">{selectedDate} at {selectedSlot}</span>
            </div>
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
              <span className="text-slate-900 font-bold">Session Fee</span>
              <span className="text-blue-600 font-black text-2xl">${selectedDoctor.cost}</span>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handlePay}
              className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-3 hover:bg-slate-900 transition-all shadow-lg active:scale-95"
            >
              <img src="https://www.gstatic.com/instantbuy/svg/googlepay_white_logo.svg" alt="GPay" className="h-6" />
              <span>Confirm with GPay</span>
            </button>
            <button 
              onClick={() => setBookingStep('slot')}
              className="w-full py-4 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors"
            >
              Cancel and Go Back
            </button>
          </div>
          
          <div className="mt-8 flex items-center justify-center space-x-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
            <span>Bank-Level Security</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorBooking;
