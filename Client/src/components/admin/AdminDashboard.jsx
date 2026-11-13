import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../services/api';
import { 
  ShieldCheck, RefreshCw, Check, X, Search, Eye, EyeOff,
  ArrowLeft, Lock, Mail, KeyRound, LogOut, Clock,
  AlertTriangle, CheckCircle2, XCircle, Loader2, Image as ImageIcon,
  User, Building2, Hash, CalendarDays, FileWarning, Sparkles, ZoomIn,
  Ban, AlertOctagon, HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ── Admin Login Screen ─────────────────────────────────────────────────────────
const AdminLoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Both email and password are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await apiService.adminLogin(email.trim(), password);
      if (res.data?.success && res.data?.token) {
        localStorage.setItem('esummit_admin_token', res.data.token);
        localStorage.setItem('esummit_admin_email', res.data.email);
        onLoginSuccess(res.data.token, res.data.email);
      } else {
        throw new Error(res.data?.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Access denied.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E2044] via-[#1a2f5a] to-[#0a1830] flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" style={{ animation: 'pulse 4s ease-in-out infinite' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C0202A]/5 rounded-full blur-[100px]" />
      </div>

      <div className={`relative w-full max-w-md ${shake ? 'animate-shake' : ''}`}>
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#C0202A] to-[#8B1520] shadow-2xl shadow-red-900/40 mb-4">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight" style={{ fontFamily: "'Times New Roman', serif" }}>
            ESUMMIT<span className="text-[#C0202A]">'27</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-medium">Administrator Control Panel</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
            <Lock className="w-4 h-4 text-red-400" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Secure Authentication</span>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@esummit.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#C0202A] to-[#9B1B22] text-white py-3.5 rounded-xl font-bold text-sm hover:from-[#D0252F] hover:to-[#A81E26] transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Authenticate & Enter
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-gray-600 mt-5">
          Restricted access. Unauthorized attempts are logged.
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

// ── ID Card Image Lightbox ────────────────────────────────────────────────────
const ImageLightbox = ({ src, onClose }) => {
  if (!src) return null;
  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-white flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <X className="w-5 h-5" /> Close
        </button>
        <img 
          src={src} 
          alt="Student ID Card" 
          className="w-full h-full object-contain rounded-2xl shadow-2xl border border-white/10"
        />
      </div>
    </div>
  );
};

// ── Status Badge Component ────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const configs = {
    pending_manual_review: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', icon: Clock, label: 'Pending Review' },
    approved: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', icon: CheckCircle2, label: 'Approved' },
    rejected: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200', icon: XCircle, label: 'Rejected' },
  };
  const config = configs[status] || configs.pending_manual_review;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${config.bg} ${config.text} ${config.border}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};

// ── AI Confidence Tag Badge Component (Genuine / Suspicious / Spam) ────────────
const TagBadge = ({ tag, score }) => {
  const normalizedTag = (tag || '').toLowerCase();
  const percentage = typeof score === 'number' ? Math.round(score * 100) : null;

  const configs = {
    genuine: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-900',
      border: 'border-emerald-300',
      dot: 'bg-emerald-500',
      icon: CheckCircle2,
      label: 'Genuine'
    },
    suspicious: {
      bg: 'bg-amber-100',
      text: 'text-amber-900',
      border: 'border-amber-300',
      dot: 'bg-amber-500',
      icon: AlertOctagon,
      label: 'Suspicious'
    },
    spam: {
      bg: 'bg-rose-100',
      text: 'text-rose-900',
      border: 'border-rose-300',
      dot: 'bg-rose-500',
      icon: Ban,
      label: 'Spam'
    }
  };

  const config = configs[normalizedTag] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300',
    dot: 'bg-gray-400',
    icon: HelpCircle,
    label: normalizedTag ? normalizedTag.toUpperCase() : 'Unclassified'
  };

  const Icon = config.icon;

  return (
    <span 
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider shadow-sm ${config.bg} ${config.text} ${config.border}`}
      title={percentage !== null ? `Confidence Score: ${percentage}%` : undefined}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
      {percentage !== null && (
        <span className="font-extrabold opacity-75 text-[10px] ml-0.5">
          ({percentage}%)
        </span>
      )}
    </span>
  );
};

// ── Main Admin Dashboard ─────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminToken, setAdminToken] = useState('');

  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reviewingId, setReviewingId] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTag, setFilterTag] = useState('all'); // 'all' | 'genuine' | 'suspicious' | 'spam'
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  // Check existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('esummit_admin_token');
      if (savedToken) {
        try {
          const res = await apiService.verifyAdminToken(savedToken);
          if (res.data?.success) {
            setAdminToken(savedToken);
            setAdminEmail(res.data.email || localStorage.getItem('esummit_admin_email') || '');
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('esummit_admin_token');
            localStorage.removeItem('esummit_admin_email');
          }
        } catch {
          localStorage.removeItem('esummit_admin_token');
          localStorage.removeItem('esummit_admin_email');
        }
      }
      setAuthChecking(false);
    };
    checkAuth();
  }, []);

  // Fetch verifications when authenticated
  const fetchVerifications = useCallback(async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const res = await apiService.getAdminVerifications(adminToken);
      setVerifications(res.data?.verifications || []);
    } catch (err) {
      console.warn('Failed to fetch verifications:', err.message);
      if (err.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchVerifications();
    }
  }, [isAuthenticated, fetchVerifications]);

  const handleLoginSuccess = (token, email) => {
    setAdminToken(token);
    setAdminEmail(email);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('esummit_admin_token');
    localStorage.removeItem('esummit_admin_email');
    setIsAuthenticated(false);
    setAdminToken('');
    setAdminEmail('');
    setVerifications([]);
  };

  const handleReview = async (id, action) => {
    setReviewingId(id);
    try {
      const res = await apiService.reviewAdminVerification(adminToken, id, { 
        action, 
        notes: reviewNotes || undefined 
      });
      alert(res.data?.message || `Verification ${action}ed successfully.`);
      setReviewNotes('');
      setExpandedCard(null);
      fetchVerifications();
    } catch (err) {
      alert(err.message || `Failed to ${action} verification.`);
      if (err.status === 401) handleLogout();
    } finally {
      setReviewingId(null);
    }
  };

  // Helper to resolve tag from verification object
  const getRecordTag = (v) => {
    if (v.tag) return v.tag.toLowerCase();
    if (v.aiAnalysis?.tag) return v.aiAnalysis.tag.toLowerCase();
    if (v.aiAnalysis?.isAiGenerated || (v.confidenceScore !== undefined && v.confidenceScore < 0.4)) return 'spam';
    if (v.flaggedSuspicious || v.status === 'pending_manual_review') return 'suspicious';
    return 'genuine';
  };

  // Helper to resolve confidence score
  const getRecordScore = (v) => {
    if (typeof v.confidenceScore === 'number') return v.confidenceScore;
    if (typeof v.aiAnalysis?.confidenceScore === 'number') return v.aiAnalysis.confidenceScore;
    return null;
  };

  // Filter & search
  const filteredVerifications = verifications.filter((v) => {
    if (filterStatus !== 'all' && v.status !== filterStatus) return false;
    if (filterTag !== 'all' && getRecordTag(v) !== filterTag) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        v.userName?.toLowerCase().includes(q) ||
        v.userEmail?.toLowerCase().includes(q) ||
        v.institution?.toLowerCase().includes(q) ||
        v.verificationId?.toLowerCase().includes(q) ||
        v.studentIdNumber?.toLowerCase().includes(q) ||
        getRecordTag(v).includes(q)
      );
    }
    return true;
  });

  const pendingCount = verifications.filter(v => v.status === 'pending_manual_review').length;
  const approvedCount = verifications.filter(v => v.status === 'approved').length;
  const rejectedCount = verifications.filter(v => v.status === 'rejected').length;

  const genuineCount = verifications.filter(v => getRecordTag(v) === 'genuine').length;
  const suspiciousCount = verifications.filter(v => getRecordTag(v) === 'suspicious').length;
  const spamCount = verifications.filter(v => getRecordTag(v) === 'spam').length;

  // Loading auth check
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#0E2044] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <AdminLoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // ── Authenticated Dashboard View ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#E8DDDC] text-[#131014] font-sans pb-16">
      {/* Lightbox */}
      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />

      {/* Top Bar */}
      <div className="fixed top-0 left-0 w-full h-[10vh] z-40 flex items-center justify-between px-4 sm:px-8 bg-[#E8DDDC]/90 backdrop-blur-xl border-b border-gray-200/50">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-[#0E2044] font-semibold text-sm hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Exit
          </button>
          <div className="hidden sm:block w-px h-6 bg-gray-300" />
          <span className="hidden sm:inline-flex px-3 py-1 bg-red-600 text-white font-bold text-[10px] rounded-full uppercase tracking-widest">
            ADMIN PANEL
          </span>
        </div>

        <div className="flex items-center gap-4">
          <h1 className="text-[#0E2044] font-extrabold text-xl tracking-wide hidden sm:block" style={{ fontFamily: "'Times New Roman', serif" }}>
            ESUMMIT<span className="text-[#C0202A]">'27</span>
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 font-medium hidden sm:block">{adminEmail}</span>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-[14vh] px-4 sm:px-8 max-w-7xl mx-auto space-y-6">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0E2044]" style={{ fontFamily: "'Times New Roman', serif" }}>
              Student ID Verification
            </h2>
            <p className="text-sm text-gray-500 mt-1">Review and verify student ID card submissions for eligibility.</p>
          </div>
          <button
            onClick={fetchVerifications}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0E2044] text-white rounded-xl font-bold text-xs hover:bg-[#162d56] transition-colors disabled:opacity-50 shadow-md"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Submissions</p>
            <p className="text-2xl font-black text-[#0E2044] mt-1">{verifications.length}</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-sm">
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Pending Review</p>
            <p className="text-2xl font-black text-amber-900 mt-1">{pendingCount}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-sm">
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Approved</p>
            <p className="text-2xl font-black text-emerald-900 mt-1">{approvedCount}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-2xl border border-red-200 shadow-sm">
            <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Rejected</p>
            <p className="text-2xl font-black text-red-900 mt-1">{rejectedCount}</p>
          </div>
        </div>

        {/* AI Classification Category Pills Bar */}
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C0202A]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#0E2044]">AI Confidence Categories:</span>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setFilterTag('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterTag === 'all'
                    ? 'bg-[#0E2044] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Categories ({verifications.length})
              </button>
              
              <button
                onClick={() => setFilterTag('genuine')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  filterTag === 'genuine'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Genuine ({genuineCount})
              </button>

              <button
                onClick={() => setFilterTag('suspicious')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  filterTag === 'suspicious'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                Suspicious ({suspiciousCount})
              </button>

              <button
                onClick={() => setFilterTag('spam')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  filterTag === 'spam'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100'
                }`}
              >
                <Ban className="w-3.5 h-3.5" />
                Spam ({spamCount})
              </button>
            </div>
          </div>
        </div>

        {/* Search & Status Filter Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, institution, ID, tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-[#0E2044] focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { id: 'all', label: 'All Status' },
              { id: 'pending_manual_review', label: `Pending (${pendingCount})` },
              { id: 'approved', label: `Approved (${approvedCount})` },
              { id: 'rejected', label: `Rejected (${rejectedCount})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  filterStatus === f.id
                    ? 'bg-[#0E2044] text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Verifications List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-[#C0202A] animate-spin" />
            <p className="text-sm font-semibold text-[#0E2044]">Loading verifications...</p>
          </div>
        ) : filteredVerifications.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-4">
              <FileWarning className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-[#0E2044]">No Verifications Found</h3>
            <p className="text-sm text-gray-500 mt-1">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'No student ID submissions have been received yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVerifications.map((v) => {
              const isExpanded = expandedCard === v.verificationId;
              const isPending = v.status === 'pending_manual_review';

              return (
                <div 
                  key={v.verificationId} 
                  className={`bg-white border rounded-2xl shadow-sm overflow-hidden transition-all ${
                    isPending ? 'border-amber-200' : 'border-gray-200'
                  }`}
                >
                  {/* Card Header */}
                  <div 
                    className="p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                    onClick={() => setExpandedCard(isExpanded ? null : v.verificationId)}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        {/* Thumbnail */}
                        {v.idCardBase64 ? (
                          <div 
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-gray-200 shrink-0 cursor-pointer relative group"
                            onClick={(e) => { e.stopPropagation(); setLightboxSrc(v.idCardBase64); }}
                          >
                            <img 
                              src={v.idCardBase64} 
                              alt="ID Card" 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                              <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 border-2 border-gray-200">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-bold text-[#0E2044] text-sm truncate">{v.userName || 'Unknown User'}</h3>
                            <StatusBadge status={v.status} />
                            <TagBadge tag={getRecordTag(v)} score={getRecordScore(v)} />
                          </div>
                          <p className="text-xs text-gray-500 truncate">{v.userEmail}</p>
                          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3 h-3" /> {v.institution || 'N/A'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Hash className="w-3 h-3" /> {v.studentIdNumber || 'N/A'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {new Date(v.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions for Pending */}
                      {isPending && !isExpanded && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleReview(v.verificationId, 'approve'); }}
                            disabled={reviewingId === v.verificationId}
                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-sm"
                          >
                            {reviewingId === v.verificationId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                            Approve
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleReview(v.verificationId, 'reject'); }}
                            disabled={reviewingId === v.verificationId}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 transition-colors disabled:opacity-50 shadow-sm"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/50">
                      <div className="p-5 space-y-5">
                        {/* ID Card Full View */}
                        <div>
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <ImageIcon className="w-3.5 h-3.5" /> Submitted ID Card
                          </h4>
                          {v.idCardBase64 ? (
                            <div 
                              className="max-w-md rounded-2xl overflow-hidden border-2 border-gray-200 shadow-sm cursor-pointer relative group"
                              onClick={() => setLightboxSrc(v.idCardBase64)}
                            >
                              <img 
                                src={v.idCardBase64} 
                                alt="Student ID Card" 
                                className="w-full h-auto"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                <div className="bg-black/60 text-white px-4 py-2 rounded-xl font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                  <ZoomIn className="w-4 h-4" /> Click to enlarge
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="max-w-md p-8 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 text-center">
                              <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                              <p className="text-xs text-gray-500">No ID card image available</p>
                            </div>
                          )}
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-2 mb-2 text-gray-500">
                              <User className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Student Name</span>
                            </div>
                            <p className="text-sm font-bold text-[#0E2044]">{v.userName || 'Not provided'}</p>
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-2 mb-2 text-gray-500">
                              <Mail className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Email</span>
                            </div>
                            <p className="text-sm font-bold text-[#0E2044] break-all">{v.userEmail || 'N/A'}</p>
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-2 mb-2 text-gray-500">
                              <Building2 className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Institution</span>
                            </div>
                            <p className="text-sm font-bold text-[#0E2044]">{v.institution || 'Not provided'}</p>
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-2 mb-2 text-gray-500">
                              <Hash className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Student ID Number</span>
                            </div>
                            <p className="text-sm font-bold text-[#0E2044]">{v.studentIdNumber || 'Not provided'}</p>
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-2 mb-2 text-gray-500">
                              <CalendarDays className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Academic Year</span>
                            </div>
                            <p className="text-sm font-bold text-[#0E2044]">{v.academicYear || 'N/A'}</p>
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-2 mb-2 text-gray-500">
                              <Clock className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Submitted At</span>
                            </div>
                            <p className="text-sm font-bold text-[#0E2044]">
                              {new Date(v.submittedAt).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>

                        {/* AI Analysis Results */}
                        {(v.suspicionReason || v.aiAnalysis || v.tag) && (
                          <div className={`p-4 rounded-xl border ${
                            getRecordTag(v) === 'spam'
                              ? 'bg-rose-50 border-rose-200'
                              : getRecordTag(v) === 'suspicious'
                              ? 'bg-amber-50 border-amber-200'
                              : 'bg-emerald-50 border-emerald-200'
                          }`}>
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-[#0E2044]">
                                <Sparkles className="w-3.5 h-3.5 text-[#C0202A]" /> AI Forensic & OCR Analysis
                              </h4>
                              <TagBadge tag={getRecordTag(v)} score={getRecordScore(v)} />
                            </div>

                            {/* Confidence Score Bar */}
                            {getRecordScore(v) !== null && (
                              <div className="mb-3">
                                <div className="flex justify-between items-center text-[11px] mb-1">
                                  <span className="font-semibold text-gray-600">Model Confidence Score:</span>
                                  <span className="font-bold text-[#0E2044]">{(getRecordScore(v) * 100).toFixed(0)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      getRecordScore(v) >= 0.75 
                                        ? 'bg-emerald-500' 
                                        : getRecordScore(v) >= 0.40 
                                        ? 'bg-amber-500' 
                                        : 'bg-rose-500'
                                    }`}
                                    style={{ width: `${Math.round(getRecordScore(v) * 100)}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {v.suspicionReason && (
                              <p className="text-xs text-gray-700 mb-2">
                                <strong>Assessment:</strong> {v.suspicionReason}
                              </p>
                            )}

                            {v.aiAnalysis && (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-gray-200/50">
                                {v.aiAnalysis.detectedInstitution && (
                                  <div className="text-xs">
                                    <span className="text-gray-500 font-semibold">Detected Institution:</span>
                                    <p className="font-bold text-[#0E2044]">{v.aiAnalysis.detectedInstitution}</p>
                                  </div>
                                )}
                                {v.aiAnalysis.detectedStudentName && (
                                  <div className="text-xs">
                                    <span className="text-gray-500 font-semibold">Detected Name:</span>
                                    <p className="font-bold text-[#0E2044]">{v.aiAnalysis.detectedStudentName}</p>
                                  </div>
                                )}
                                {v.aiAnalysis.detectedStudentId && (
                                  <div className="text-xs">
                                    <span className="text-gray-500 font-semibold">Detected ID:</span>
                                    <p className="font-bold text-[#0E2044]">{v.aiAnalysis.detectedStudentId}</p>
                                  </div>
                                )}
                                {v.aiAnalysis.summary && (
                                  <div className="text-xs col-span-2 sm:col-span-3">
                                    <span className="text-gray-500 font-semibold">Analysis Summary:</span>
                                    <p className="text-gray-700 mt-0.5">{v.aiAnalysis.summary}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Review Notes & Actions (only for pending) */}
                        {isPending && (
                          <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Admin Review Action</h4>
                            <textarea
                              placeholder="Optional: Add review notes or reason for decision..."
                              value={reviewNotes}
                              onChange={(e) => setReviewNotes(e.target.value)}
                              rows={2}
                              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#0E2044] focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 resize-none"
                            />
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleReview(v.verificationId, 'approve')}
                                disabled={reviewingId === v.verificationId}
                                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-md"
                              >
                                {reviewingId === v.verificationId ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                Approve Student
                              </button>
                              <button
                                onClick={() => handleReview(v.verificationId, 'reject')}
                                disabled={reviewingId === v.verificationId}
                                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 transition-colors disabled:opacity-50 shadow-md"
                              >
                                {reviewingId === v.verificationId ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                Reject Submission
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Already reviewed info */}
                        {v.reviewedAt && (
                          <div className="bg-gray-100 p-3 rounded-xl text-xs text-gray-600">
                            <strong>Reviewed at:</strong> {new Date(v.reviewedAt).toLocaleString('en-IN')} 
                            {v.reviewNotes && <> — <strong>Notes:</strong> {v.reviewNotes}</>}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
