import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle2, ShieldCheck, Ticket, AlertCircle, X,
  LogIn, Sparkles, ArrowRight, Loader2, ExternalLink
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const RegistrationModal = ({ isOpen, onClose }) => {
  const {
    isSignedIn,
    currentUserEmail,
    currentUserName,
    isTCETStudent,
    loginWithClerk,
    getClerkToken,
    isLoaded,
  } = useAuth();

  const [step, setStep] = useState('idle'); // idle | loading | tcet_success | tcet_already | non_tcet | error
  const [resultData, setResultData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showWidget, setShowWidget] = useState(false);

  if (!isOpen) return null;

  const handleRegister = async () => {
    if (!isSignedIn) {
      loginWithClerk();
      return;
    }

    setStep('loading');
    setErrorMsg('');
    setResultData(null);

    try {
      const token = await getClerkToken();
      if (!token) throw new Error('Could not get auth token. Please sign in again.');

      const res = await fetch(`${API_BASE}/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Server error ${res.status}`);
      }

      setResultData(data);

      if (!data.isTCET) {
        // Non-TCET: show KonfHub widget
        setStep('non_tcet');
        setShowWidget(false);
      } else if (data.alreadyRegistered) {
        setStep('tcet_already');
      } else {
        setStep('tcet_success');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      setStep('error');
    }
  };

  const resetModal = () => {
    setStep('idle');
    setResultData(null);
    setErrorMsg('');
    setShowWidget(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#FDFDFE] border border-gray-200 rounded-2xl shadow-2xl overflow-hidden text-[#131014]">

        {/* Header */}
        <div className="navyBg px-6 py-5 text-white flex justify-between items-center">
          <div>
            <span className="text-[#E0B09D] text-xs font-bold tracking-widest uppercase">E-SUMMIT '27 Registration</span>
            <h2 className="text-2xl font-bold timesNewRoman leading-tight">Register for the Event</h2>
          </div>
          <button onClick={handleClose} className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 bg-[#F7F6F7]">

          {/* ── Not signed in ── */}
          {!isLoaded || (!isSignedIn && step === 'idle') ? (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-red-50 text-[#C0202A] rounded-full flex items-center justify-center mx-auto shadow-inner border border-red-100">
                <LogIn className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-[#0E2044] timesNewRoman">Sign In to Register</h3>
                <p className="text-xs text-gray-600 max-w-xs mx-auto">
                  Sign in with Google or email. TCET students (@tcetmumbai.in) get a <strong>free pass</strong> automatically — no payment needed.
                </p>
              </div>
              <button
                id="modal-signin-btn"
                onClick={loginWithClerk}
                className="w-full redBg text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-[#E0B09D]" />
                Sign In / Sign Up →
              </button>
            </div>

          ) : step === 'idle' && isSignedIn ? (
            /* ── Signed in, ready to register ── */
            <div className="space-y-5">
              {/* User info card */}
              <div className="flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-xl">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Signed in as</span>
                  <span className="font-bold text-[#0E2044] text-sm">{currentUserName}</span>
                  <span className="text-xs text-gray-500 block">{currentUserEmail}</span>
                </div>
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
              </div>

              {/* Pass type preview */}
              {isTCETStudent ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800 flex items-start gap-2">
                  <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                  <div>
                    <p className="font-bold text-emerald-900">TCET Student detected</p>
                    <p className="text-xs mt-0.5">Your <strong>@tcetmumbai.in</strong> account qualifies for a <strong>free pass</strong>. Click below to register instantly — no ticket selection needed.</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex items-start gap-2">
                  <Ticket className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                  <div>
                    <p className="font-bold text-amber-900">External attendee</p>
                    <p className="text-xs mt-0.5">Paid tickets are available through our KonfHub page. Click register to open the ticket selection widget.</p>
                  </div>
                </div>
              )}

              <button
                id="modal-register-confirm-btn"
                onClick={handleRegister}
                className="w-full redBg text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md"
              >
                {isTCETStudent ? (
                  <><ShieldCheck className="w-5 h-5" /> Register Free (TCET Pass) <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <><Ticket className="w-5 h-5" /> View Ticket Options <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>

          ) : step === 'loading' ? (
            /* ── Loading ── */
            <div className="text-center py-10 space-y-4">
              <Loader2 className="w-12 h-12 text-[#C0202A] animate-spin mx-auto" />
              <div>
                <h3 className="text-lg font-bold text-[#0E2044]">Processing your registration…</h3>
                <p className="text-xs text-gray-500 font-mono mt-1">{currentUserEmail}</p>
              </div>
            </div>

          ) : step === 'tcet_success' ? (
            /* ── TCET — new registration ── */
            <div className="space-y-5">
              <div className="flex flex-col items-center text-center gap-3 py-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-900 timesNewRoman">You're Registered!</h3>
                <p className="text-sm text-emerald-800 max-w-xs">
                  Your TCET free pass has been confirmed on KonfHub. Check your email <strong>{currentUserEmail}</strong> for the confirmation.
                </p>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-emerald-900 text-sm uppercase tracking-wider">TCET Student Free Pass</span>
                </div>
                <p className="text-xs text-emerald-700">Registered for <strong>E-Summit '27</strong> · 21–22 Jan 2027 · TCET Mumbai</p>
                <p className="text-xs text-emerald-700 font-mono">Delegate: {currentUserName} · {currentUserEmail}</p>
              </div>
              <button onClick={handleClose} className="w-full navyBg text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
                Done
              </button>
            </div>

          ) : step === 'tcet_already' ? (
            /* ── TCET — already registered ── */
            <div className="space-y-5">
              <div className="flex flex-col items-center text-center gap-3 py-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-[#0E2044] timesNewRoman">Already Registered!</h3>
                <p className="text-sm text-gray-600 max-w-xs">
                  <strong>{currentUserEmail}</strong> already has a TCET free pass for E-Summit '27. Check your email for the ticket details.
                </p>
              </div>
              <button onClick={handleClose} className="w-full navyBg text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
                Got it
              </button>
            </div>

          ) : step === 'non_tcet' ? (
            /* ── Non-TCET — KonfHub widget ── */
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-sm text-amber-800 flex items-start gap-2">
                <Ticket className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <p className="font-bold text-amber-900">Select & Purchase Your Ticket</p>
                  <p className="text-xs mt-0.5">Choose from available ticket types below and complete payment securely via KonfHub.</p>
                </div>
              </div>

              {!showWidget ? (
                <button
                  id="open-widget-btn"
                  onClick={() => setShowWidget(true)}
                  className="w-full redBg text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md"
                >
                  <ExternalLink className="w-5 h-5" /> Open Ticket Widget
                </button>
              ) : (
                <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <iframe
                    src="https://konfhub.com/widget/id/38580027-52e6-43dc-b984-7b86d3a7b56c"
                    id="konfhub-widget"
                    title="Register for TCET's E-SUMMIT '27"
                    width="100%"
                    height="500"
                    allow="payment"
                  />
                </div>
              )}

              <button onClick={handleClose} className="w-full bg-white border border-gray-300 text-[#0E2044] py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
                Close
              </button>
            </div>

          ) : step === 'error' ? (
            /* ── Error ── */
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">Registration Failed</p>
                  <p className="text-xs mt-1">{errorMsg}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={resetModal} className="flex-1 redBg text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
                  Try Again
                </button>
                <button onClick={handleClose} className="flex-1 bg-white border border-gray-300 text-[#0E2044] py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
                  Close
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
