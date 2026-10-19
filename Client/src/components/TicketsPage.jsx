import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import {
  Ticket,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  GraduationCap,
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';
import TicketDetailModal from './TicketDetailModal';
import StudentVerificationModal from './StudentVerificationModal';

const TicketsPage = () => {
  const {
    isSignedIn,
    currentUserEmail,
    currentUserName,
    isTCETStudent,
    loginWithClerk,
    getClerkToken,
    isLoaded,
  } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'student' | 'pro' | 'pitch'
  const [studentEligibility, setStudentEligibility] = useState(null);

  // Modals state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [clerkToken, setClerkToken] = useState(null);

  // Fetch tickets and verification status
  useEffect(() => {
    loadTicketsAndEligibility();
  }, [isSignedIn, isTCETStudent]);

  const loadTicketsAndEligibility = async () => {
    setLoading(true);
    setPageError('');
    try {
      let token = null;
      if (isSignedIn) {
        token = await getClerkToken();
        setClerkToken(token);
      }

      // Load tickets from authoritative backend API
      const res = await apiService.getTickets(token);
      if (res.data?.success) {
        setTickets(res.data.tickets || []);
        if (res.data.studentEligibility) {
          setStudentEligibility(res.data.studentEligibility);
        }
      } else {
        throw new Error(res.data?.message || 'Failed to fetch tickets.');
      }
    } catch (err) {
      console.warn('Backend ticket fetch error:', err.message);
      setPageError('Unable to load ticket catalogue. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const isStudentVerified =
    isTCETStudent ||
    (studentEligibility && studentEligibility.status === 'verified');

  const handleCardClick = (ticket) => {
    setSelectedTicket(ticket);
    setPurchaseError('');
    setPurchaseSuccess(false);
    setDetailModalOpen(true);
  };

  const handlePurchase = async (ticket) => {
    if (!isSignedIn) {
      loginWithClerk();
      return;
    }

    setPurchaseLoading(true);
    setPurchaseError('');

    try {
      // Always request a fresh, unexpired token from Clerk before booking
      const token = await getClerkToken({ skipCache: true }) || (await getClerkToken());
      if (!token) {
        loginWithClerk();
        throw new Error('Your session expired. Please sign in again to complete your booking.');
      }

      // Generate idempotency key for this order attempt
      const idempotencyKey = `esummit_${currentUserEmail}_${ticket.slug}_${Date.now()}`;

      const res = await apiService.createOrder(token, {
        ticketSlug: ticket.slug,
        idempotencyKey,
      });

      if (res.data?.success) {
        setPurchaseSuccess(true);
      } else {
        throw new Error(res.data?.message || 'Booking failed.');
      }
    } catch (err) {
      const msg = err.data?.message || err.message || 'Order execution failed.';
      if (msg.toLowerCase().includes('jwt is expired') || msg.toLowerCase().includes('token')) {
        setPurchaseError('Your session expired. Please sign in again.');
      } else {
        setPurchaseError(msg);
      }
      if (err.data?.requireStudentVerification) {
        setVerificationModalOpen(true);
      }
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleVerificationSuccess = (record) => {
    setStudentEligibility(record);
    // Refresh tickets
    loadTicketsAndEligibility();
  };

  // Filter tickets by category tab
  const filteredTickets = tickets.filter((t) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'student') {
      return t.requiresStudentVerification || t.eligibility.tcetOnly;
    }
    if (selectedCategory === 'pitch') {
      return t.slug.includes('open-stage') || t.slug.includes('showcase');
    }
    if (selectedCategory === 'pro') {
      return !t.requiresStudentVerification && !t.eligibility.tcetOnly;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#E8DDDC] text-[#131014] font-sans pb-24 pt-[11vh]">
      {/* Top Banner / Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/70 backdrop-blur border border-white rounded-full text-xs font-bold text-red-600 uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Official Delegate Registration
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black timesNewRoman text-[#0E2044] tracking-tight">
            Choose Your Summit Pass
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Experience 2 power-packed days of founder keynotes, startup expos, investor pitching, and high-impact networking at E-Summit '27.
          </p>

          {/* User Status Bar */}
          <div className="pt-3">
            {!isLoaded ? (
              <div className="h-10 w-48 bg-white/50 animate-pulse rounded-full mx-auto" />
            ) : isSignedIn ? (
              <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-white/80 backdrop-blur-md px-5 py-2 rounded-2xl border border-white shadow-sm text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-[#0E2044]">
                    Signed in as <strong>{currentUserEmail}</strong>
                  </span>
                </div>

                {isTCETStudent ? (
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                    <ShieldCheck className="w-3.5 h-3.5" /> TCET Student (Free Pass Eligible)
                  </span>
                ) : isStudentVerified ? (
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                    <GraduationCap className="w-3.5 h-3.5" /> Student Verified ({studentEligibility?.institution || 'Enrolled'})
                  </span>
                ) : (
                  <button
                    onClick={() => setVerificationModalOpen(true)}
                    className="redBg text-white px-3 py-1 rounded-full font-bold hover:opacity-95 transition-opacity flex items-center gap-1 shadow-sm"
                  >
                    <GraduationCap className="w-3.5 h-3.5" /> Verify Student Status for Discounts
                  </button>
                )}
              </div>
            ) : (
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white shadow-sm text-xs text-gray-600">
                <span>Have an institutional account?</span>
                <button
                  onClick={loginWithClerk}
                  className="font-bold text-[#C0202A] hover:underline flex items-center gap-1"
                >
                  Sign In to unlock student rates <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filter Tabs (Only shown for non-TCET users who see full catalogue) */}
        {!isTCETStudent && tickets.length > 1 && (
          <div className="flex justify-center mt-8">
            <div className="inline-flex p-1.5 bg-white/70 backdrop-blur-md rounded-2xl border border-white shadow-sm gap-1 overflow-x-auto max-w-full">
              {[
                { id: 'all', label: 'All Passes' },
                { id: 'student', label: 'Student Discounted' },
                { id: 'pro', label: 'Professional & VIP' },
                { id: 'pitch', label: 'Pitching & Showcase' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === tab.id
                      ? 'navyBg text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TCET Exclusive Banner */}
        {isTCETStudent && (
          <div className="mt-8 max-w-2xl mx-auto p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-950 backdrop-blur-sm">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold block text-sm">Verified TCET Student Account</span>
              Your authenticated <strong>@tcetmumbai.in</strong> email grants you 100% complimentary access. Non-TCET passes are hidden.
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-10 h-10 text-[#C0202A] animate-spin" />
            <p className="text-sm font-semibold text-[#0E2044]">Loading verified pass catalogue...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && pageError && (
          <div className="max-w-md mx-auto my-12 p-6 bg-red-50 border border-red-200 rounded-3xl text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
            <h3 className="text-base font-bold text-red-900">Failed to Load Passes</h3>
            <p className="text-xs text-red-700">{pageError}</p>
            <button
              onClick={loadTicketsAndEligibility}
              className="redBg text-white px-5 py-2 rounded-xl text-xs font-bold hover:opacity-90 shadow"
            >
              Retry
            </button>
          </div>
        )}

        {/* Ticket Cards Grid */}
        {!loading && !pageError && (
          filteredTickets.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-sm">
              No tickets found in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-10">
              {filteredTickets.map((t) => {
                const requiresVerification = t.requiresStudentVerification && !isStudentVerified;
                const isTCETPass = t.eligibility.tcetOnly;

                return (
                  <div
                    key={t.slug}
                    onClick={() => handleCardClick(t)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(t); }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Select ${t.name}`}
                    className={`group relative flex flex-col justify-between bg-[#FDFDFE] border rounded-3xl p-6 sm:p-7 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#C0202A] ${
                      isTCETPass
                        ? 'border-emerald-300 ring-2 ring-emerald-500/20'
                        : t.tag?.includes('Popular')
                        ? 'border-red-300 ring-2 ring-red-500/20'
                        : 'border-gray-200'
                    }`}
                  >
                    {/* Top Tag & Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                        isTCETPass
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : t.tag?.includes('Popular')
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {t.tag || 'Official Pass'}
                      </span>

                      {requiresVerification && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                          <Lock className="w-3 h-3" /> Student ID Req.
                        </span>
                      )}
                    </div>

                    {/* Name & Pricing */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold timesNewRoman text-[#0E2044] group-hover:text-[#C0202A] transition-colors leading-tight mb-2">
                        {t.name}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                        {t.shortDescription || t.description}
                      </p>

                      <div className="flex items-baseline gap-1 my-3">
                        <span className="text-3xl sm:text-4xl font-extrabold text-[#0E2044] tracking-tight">
                          {t.price === 0 ? 'Free' : `₹${t.price.toLocaleString('en-IN')}`}
                        </span>
                        {t.price > 0 && (
                          <span className="text-[11px] text-gray-500 font-medium">/ attendee</span>
                        )}
                      </div>
                    </div>

                    {/* Inclusions Snippet */}
                    <div className="border-t border-gray-100 pt-4 mt-2 space-y-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                        Highlighted Benefits
                      </span>
                      {t.inclusions && t.inclusions.slice(0, 3).map((inc, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{inc}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Card Footer */}
                    <div className="mt-6 pt-3 flex items-center justify-between text-xs font-bold text-[#C0202A] group-hover:translate-x-1 transition-transform">
                      <span>View Inclusions &amp; Book</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* Reusable Floating Ticket Details Modal */}
      <TicketDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        ticket={selectedTicket}
        onPurchase={handlePurchase}
        onOpenVerification={() => {
          setDetailModalOpen(false);
          setVerificationModalOpen(true);
        }}
        isStudentVerified={isStudentVerified}
        isTCETStudent={isTCETStudent}
        purchaseLoading={purchaseLoading}
        purchaseError={purchaseError}
        purchaseSuccess={purchaseSuccess}
      />

      {/* Student Eligibility Verification Modal */}
      <StudentVerificationModal
        isOpen={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
        onSuccess={handleVerificationSuccess}
        clerkToken={clerkToken}
        currentEmail={currentUserEmail}
      />
    </div>
  );
};

export default TicketsPage;
