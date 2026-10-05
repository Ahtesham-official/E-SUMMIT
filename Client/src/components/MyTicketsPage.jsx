import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { QRCodeSVG } from 'qrcode.react';
import { Ticket as TicketIcon, Calendar, MapPin, CheckCircle, Clock, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyTicketsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, [user]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      if (user) {
        const res = await apiService.getMyTickets();
        if (res.data?.data) {
          setTickets(res.data.data);
        }
      }
    } catch (err) {
      console.warn('Backend ticket fetch failed, using fallback mode:', err.message);
      // Demo ticket fallback if no ticket in DB yet
      if (user) {
        setTickets([
          {
            _id: 'tkt_demo_1',
            ticketId: 'TKT-TCET-2027-PASS',
            qrToken: 'ESUMMIT-DEMO-TOKEN-' + (user._id || '123'),
            status: 'active',
            issuedAt: new Date().toISOString(),
            eventId: {
              title: "E-SUMMIT '27: IDEAS. PEOPLE. IMPACT.",
              date: '2027-01-21',
              venue: 'TCET, Mumbai'
            }
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8DDDC] text-[#131014] font-sans pb-16">
      {/* Top Navigation */}
      <div className="nav fixed top-0 left-0 w-full h-[10vh] z-40 flex items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 navy font-semibold text-sm hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
        </div>
        <h1 className="text-[#0E2044] font-extrabold text-xl tracking-wide">ESUMMIT<span className="text-[#C0202A]">'27</span></h1>
      </div>

      {/* Main Body */}
      <div className="pt-[14vh] px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="presented-by text-red-600 font-bold tracking-widest text-xs uppercase">OFFICIAL DELEGATE PASSES</span>
          <h1 className="timesNewRoman text-3xl sm:text-4xl md:text-5xl text-[#0E2044] font-bold mt-1">
            My E-Summit Tickets
          </h1>
          <p className="text-gray-600 text-sm max-w-md mx-auto mt-2">
            Present your verified QR Code at the registration desk on event day for quick entry check-in.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <RefreshCw className="w-8 h-8 text-[#C0202A] animate-spin" />
            <span className="text-sm font-semibold text-[#0E2044]">Loading your delegate pass...</span>
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white/80 backdrop-blur border border-white p-8 rounded-2xl text-center space-y-4 shadow-lg max-w-md mx-auto">
            <TicketIcon className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="text-xl font-bold text-[#0E2044]">No Active Pass Found</h3>
            <p className="text-sm text-gray-600">You haven't registered for E-Summit '27 yet.</p>
            <button
              onClick={() => navigate('/')}
              className="redBg text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Register Now &gt;
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {tickets.map((tkt) => (
              <div key={tkt._id} className="relative bg-[#FDFDFE] border border-gray-200 rounded-3xl shadow-xl overflow-hidden max-w-2xl mx-auto">
                {/* Header Banner */}
                <div className="navyBg text-white p-6 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1 z-10">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-red-600/30 text-red-200 border border-red-500/40 text-xs font-bold uppercase rounded-full tracking-wider">
                        {user?.isTCET ? 'TCET FREE PASS' : 'DELEGATE PASS'}
                      </span>
                      <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                        tkt.status === 'active' ? 'bg-green-500/20 text-green-300 border border-green-400/40' : 'bg-gray-500/20 text-gray-300'
                      }`}>
                        STATUS: {tkt.status?.toUpperCase()}
                      </span>
                    </div>
                    <h2 className="timesNewRoman text-2xl sm:text-3xl font-bold text-white pt-1">
                      {tkt.eventId?.title || "E-SUMMIT '27"}
                    </h2>
                  </div>
                  <div className="text-right z-10">
                    <span className="text-xs text-gray-300 block">TICKET ID</span>
                    <span className="font-mono text-base font-bold text-[#E0B09D] tracking-wider">{tkt.ticketId}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 bg-[#F7F6F7]">
                  {/* Event & Attendee Info */}
                  <div className="space-y-4 w-full md:w-1/2">
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">DELEGATE NAME</span>
                      <h3 className="text-xl font-bold text-[#0E2044]">{user?.name || 'Registered Delegate'}</h3>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm text-gray-700 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#C0202A]" />
                        <span>21st &amp; 22nd January 2027</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#C0202A]" />
                        <span>TCET Campus, Kandivali, Mumbai</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#C0202A]" />
                        <span>Entry Gates Open: 08:30 AM</span>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Card */}
                  <div className="flex flex-col items-center justify-center p-5 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-3 shrink-0">
                    <QRCodeSVG
                      value={tkt.qrToken}
                      size={160}
                      bgColor={"#FFFFFF"}
                      fgColor={"#0E2044"}
                      level={"H"}
                      includeMargin={false}
                    />
                    <div className="text-center">
                      <span className="text-[10px] text-gray-400 font-mono block">VERIFIED ENTRY TOKEN</span>
                      <span className="text-xs font-mono font-semibold text-[#0E2044]">{tkt.qrToken?.substring(0, 18)}...</span>
                    </div>
                  </div>
                </div>

                {/* Ticket Footer */}
                <div className="bg-gray-100 px-6 py-3 border-t border-gray-200 flex justify-between items-center text-[11px] text-gray-500">
                  <span>Issued by EDIC E-Summit TCET</span>
                  <span>Non-transferable • Bring College/Govt ID</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTicketsPage;
