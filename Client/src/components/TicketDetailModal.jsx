import React, { useEffect } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  Lock,
  Tag,
  Check,
  ExternalLink,
  Info
} from 'lucide-react';

const TicketDetailModal = ({
  isOpen,
  onClose,
  ticket,
  onPurchase,
  onOpenVerification,
  isStudentVerified,
  isTCETStudent,
  purchaseLoading,
  purchaseError,
  purchaseSuccess,
}) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !ticket) return null;

  const requiresVerification = ticket.requiresStudentVerification && !isStudentVerified && !isTCETStudent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div
        className="relative w-full max-w-2xl bg-[#FDFDFE] border border-gray-200 rounded-3xl shadow-2xl overflow-hidden text-[#131014] max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-modal-title"
      >
        {/* Header */}
        <div className="navyBg px-6 sm:px-8 py-5 text-white flex justify-between items-start border-b border-white/10 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#E0B09D] text-xs font-bold tracking-widest uppercase">
                {ticket.tag || 'Official Pass'}
              </span>
              {ticket.requiresStudentVerification && (
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300/30">
                  Student Verification Required
                </span>
              )}
            </div>
            <h2 id="ticket-modal-title" className="text-2xl sm:text-3xl font-bold timesNewRoman leading-tight">
              {ticket.name}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-gray-300 uppercase tracking-widest block font-medium">Price</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#E0B09D]">
                {ticket.price === 0 ? 'Free' : `₹${ticket.price.toLocaleString('en-IN')}`}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close ticket details"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Success State */}
          {purchaseSuccess ? (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-950 timesNewRoman">
                Pass Booked Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
                Your registration for <strong>{ticket.name}</strong> is confirmed on KonfHub. Official confirmation details have been dispatched to your email.
              </p>
              <button
                onClick={onClose}
                className="navyBg text-white px-8 py-2.5 rounded-xl font-bold text-xs hover:opacity-95 shadow-md"
              >
                Close & View Passes
              </button>
            </div>
          ) : (
            <>
              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">About This Pass</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {ticket.description}
                </p>
              </div>

              {/* Inclusions & Benefits */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">What's Included</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ticket.inclusions && ticket.inclusions.length > 0 ? (
                    ticket.inclusions.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 bg-gray-50 border border-gray-200/80 rounded-xl"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                        <span className="text-xs text-gray-800 font-medium leading-snug">{item}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-500">
                      Standard E-Summit '27 delegate credentials included.
                    </div>
                  )}
                </div>
              </div>

              {/* Eligibility Requirements Notice */}
              {ticket.eligibility?.note && (
                <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-blue-900 uppercase tracking-wider">Eligibility Rule</h5>
                    <p className="text-xs text-blue-800 mt-0.5">{ticket.eligibility.note}</p>
                  </div>
                </div>
              )}

              {/* Verification Block if Locked */}
              {requiresVerification && (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-amber-900">Student Verification Required</p>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        Please verify your student email or college ID card to unlock this discounted rate.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onOpenVerification}
                    className="redBg text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap hover:opacity-95 transition-opacity shadow-sm shrink-0"
                  >
                    Verify Student Status →
                  </button>
                </div>
              )}

              {/* Error feedback */}
              {purchaseError && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{purchaseError}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!purchaseSuccess && (
          <div className="p-6 bg-gray-50/90 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-gray-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Direct registration &amp; instant KonfHub sync</span>
            </div>

            <div className="flex gap-2.5 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-100 transition-colors"
              >
                Close
              </button>

              <button
                onClick={() => onPurchase(ticket)}
                disabled={purchaseLoading || requiresVerification}
                className="flex-1 sm:flex-none redBg text-white px-7 py-2.5 rounded-xl text-xs font-bold hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {purchaseLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Booking Ticket...</span>
                  </>
                ) : requiresVerification ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Verify to Unlock</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#E0B09D]" />
                    <span>{ticket.price === 0 ? 'Get Free Pass' : `Purchase Pass (₹${ticket.price})`}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetailModal;
