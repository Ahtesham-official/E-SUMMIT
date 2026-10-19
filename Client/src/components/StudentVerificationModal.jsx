import React, { useState } from 'react';
import {
  X,
  Mail,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { apiService } from '../services/api';

const StudentVerificationModal = ({
  isOpen,
  onClose,
  onSuccess,
  clerkToken,
  currentEmail,
}) => {
  const [activeTab, setActiveTab] = useState('email'); // 'email' | 'idCard'
  const [collegeEmail, setCollegeEmail] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [studentIdNumber, setStudentIdNumber] = useState('');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [fileBase64, setFileBase64] = useState('');
  const [fileName, setFileName] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [devOtpHint, setDevOtpHint] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!collegeEmail) {
      setErrorMsg('Please enter your institutional / college email.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setDevOtpHint('');

    try {
      const res = await apiService.startEmailVerification(clerkToken, {
        collegeEmail,
        collegeName,
      });
      setOtpSent(true);
      if (res.data?.devOtpPreview) {
        setDevOtpHint(res.data.devOtpPreview);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send verification OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setErrorMsg('Please enter the 6-digit OTP.');
      return;
    }
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await apiService.confirmEmailVerification(clerkToken, {
        collegeEmail,
        otp,
      });
      onSuccess(res.data?.studentEligibility);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('File size must be under 8MB.');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFileBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitId = async (e) => {
    e.preventDefault();
    if (!collegeName) {
      setErrorMsg('Please provide your College / University name.');
      return;
    }
    if (!fileBase64) {
      setErrorMsg('Please upload a photo of your Student ID card.');
      return;
    }
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await apiService.submitStudentIdEvidence(clerkToken, {
        collegeName,
        studentIdNumber,
        academicYear,
        idCardBase64: fileBase64,
      });
      onSuccess(res.data?.studentEligibility);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit student ID verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#FDFDFE] border border-gray-200 rounded-3xl shadow-2xl overflow-hidden text-[#131014]">
        {/* Header */}
        <div className="navyBg px-6 py-5 text-white flex justify-between items-center border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/30 flex items-center justify-center border border-red-400/30 text-white">
              <GraduationCap className="w-5 h-5 text-[#E0B09D]" />
            </div>
            <div>
              <span className="text-[#E0B09D] text-[10px] font-bold tracking-widest uppercase block">Eligibility Portal</span>
              <h2 className="text-xl font-bold timesNewRoman">Student Eligibility Verification</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-200 bg-gray-50/80 px-6 pt-3 gap-2">
          <button
            onClick={() => { setActiveTab('email'); setErrorMsg(''); }}
            className={`pb-2.5 px-3 font-semibold text-xs flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'email'
                ? 'border-[#C0202A] text-[#C0202A]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5" /> Method A: College Email OTP
          </button>
          <button
            onClick={() => { setActiveTab('idCard'); setErrorMsg(''); }}
            className={`pb-2.5 px-3 font-semibold text-xs flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'idCard'
                ? 'border-[#C0202A] text-[#C0202A]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> Method B: Student ID Card
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'email' ? (
            /* Method A: College Email OTP */
            !otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <p className="text-xs text-gray-600 leading-relaxed">
                  Enter your official college or university email address (e.g., <code className="text-red-700 bg-red-50 px-1 py-0.5 rounded">.edu</code>, <code className="text-red-700 bg-red-50 px-1 py-0.5 rounded">.ac.in</code>). We will dispatch a 6-digit confirmation code.
                </p>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                    College / University Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. VJTI Mumbai / IIT Bombay"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                    Institutional Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your.name@college.edu.in"
                    value={collegeEmail}
                    onChange={(e) => setCollegeEmail(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full redBg text-white py-3 rounded-xl font-bold text-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Send 6-Digit OTP Code
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmOtp} className="space-y-4">
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>OTP sent to <strong>{collegeEmail}</strong></span>
                </div>

                {devOtpHint && (
                  <div className="p-2.5 bg-amber-50 border border-amber-300 text-amber-800 text-xs rounded-xl flex items-center justify-between">
                    <span>Developer OTP Hint:</span>
                    <span className="font-mono font-bold text-sm tracking-widest text-[#0E2044]">{devOtpHint}</span>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center tracking-[0.4em] font-mono text-base px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                  />
                </div>

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtp(''); }}
                    className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-50"
                  >
                    Change Email
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 redBg text-white py-2.5 rounded-xl text-xs font-bold hover:opacity-95 flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    Confirm & Unlock
                  </button>
                </div>
              </form>
            )
          ) : (
            /* Method B: Student ID Card Upload */
            <form onSubmit={handleSubmitId} className="space-y-4">
              <p className="text-xs text-gray-600 leading-relaxed">
                If your university doesn't issue official email addresses, upload a clear photo of your student ID card or recent fee receipt.
              </p>

              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  College / University Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. University of Mumbai"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                    Roll / Student ID No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CS2024-89"
                    value={studentIdNumber}
                    onChange={(e) => setStudentIdNumber(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                    Academic Year
                  </label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                  >
                    <option value="2026-2027">2026 - 2027</option>
                    <option value="2025-2026">2025 - 2026</option>
                    <option value="2024-2025">2024 - 2025</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Upload Student ID Card Photo *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center hover:border-red-600/50 transition-colors bg-white">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="student-id-input"
                  />
                  <label htmlFor="student-id-input" className="cursor-pointer block">
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1.5" />
                    <span className="text-xs font-semibold text-[#0E2044] block">
                      {fileName ? fileName : 'Click to upload Student ID card (JPG, PNG, PDF)'}
                    </span>
                    <span className="text-[10px] text-gray-400">Max file size 8MB</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !fileBase64}
                className="w-full redBg text-white py-3 rounded-xl font-bold text-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                Submit ID for Instant Verification
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentVerificationModal;
