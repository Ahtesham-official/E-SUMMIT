import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { Html5Qrcode } from 'html5-qrcode';
import { QrCode, CheckCircle2, AlertTriangle, XCircle, ArrowLeft, RefreshCw, UserCheck, ShieldAlert, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VolunteerScanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [scanning, setScanning] = useState(false);
  const [manualToken, setManualToken] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [cameraError, setCameraError] = useState('');
  
  const qrRegionId = "reader";
  const html5QrcodeRef = useRef(null);

  useEffect(() => {
    fetchSessions();
    return () => {
      stopScannerSilently();
    };
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await apiService.getSessions();
      if (res.data?.data) {
        setSessions(res.data.data);
      }
    } catch (err) {
      console.warn('Could not fetch sessions list:', err.message);
    }
  };

  const stopScannerSilently = async () => {
    if (html5QrcodeRef.current && html5QrcodeRef.current.isScanning) {
      try {
        await html5QrcodeRef.current.stop();
      } catch (e) {
        console.warn('Scanner stop warning:', e);
      }
    }
  };

  const startCameraScanner = async () => {
    setCameraError('');
    setScanning(true);
    setScanResult(null);

    setTimeout(async () => {
      try {
        const html5Qrcode = new Html5Qrcode(qrRegionId);
        html5QrcodeRef.current = html5Qrcode;

        await html5Qrcode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            handleScanSuccess(decodedText);
            html5Qrcode.stop();
            setScanning(false);
          },
          (errorMessage) => {
            // quiet scan progress
          }
        );
      } catch (err) {
        console.error('Camera launch failed:', err);
        setCameraError('Camera access denied or unavailable. Use manual token search below.');
        setScanning(false);
      }
    }, 300);
  };

  const handleScanSuccess = async (qrToken) => {
    setLoading(true);
    setScanResult(null);

    try {
      const res = await apiService.scanQRCode(qrToken, selectedSessionId || null);
      if (res.data && res.data.success) {
        setScanResult({
          status: 'success',
          data: res.data.data
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Check-in failed';
      const isDuplicate = msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('already');
      setScanResult({
        status: isDuplicate ? 'duplicate' : 'error',
        message: msg
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    handleScanSuccess(manualToken.trim());
    setManualToken('');
  };

  return (
    <div className="min-h-screen bg-[#E8DDDC] text-[#131014] font-sans pb-16">
      {/* Top Navbar */}
      <div className="nav fixed top-0 left-0 w-full h-[10vh] z-40 flex items-center justify-between px-6 md:px-10">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 navy font-semibold text-sm hover:text-red-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="navy font-bold text-sm tracking-wide">VOLUNTEER SCANNER</span>
        </div>
      </div>

      <div className="pt-[14vh] px-4 sm:px-6 max-w-xl mx-auto space-y-6">
        {/* Title Header */}
        <div className="text-center space-y-1">
          <span className="presented-by text-red-600 font-bold tracking-widest text-xs uppercase">REAL-TIME ATTENDANCE CHECK-IN</span>
          <h1 className="timesNewRoman text-3xl sm:text-4xl text-[#0E2044] font-bold">
            QR Code Verifier
          </h1>
          <p className="text-xs text-gray-600">Scan delegate tickets at entry points or session halls.</p>
        </div>

        {/* Session Selector */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-1.5">
          <label className="block text-xs font-bold text-[#0E2044] uppercase tracking-wider">Target Event / Session</label>
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-[#0E2044] focus:outline-none focus:border-[#C0202A]"
          >
            <option value="">General Main Event Check-In</option>
            {sessions.map((s) => (
              <option key={s._id} value={s._id}>
                Session: {s.title} ({s.venue})
              </option>
            ))}
          </select>
        </div>

        {/* Scanner Card */}
        <div className="bg-[#FDFDFE] border border-gray-200 rounded-2xl shadow-xl overflow-hidden p-6 text-center space-y-5">
          {/* Camera Container */}
          <div className="relative bg-gray-900 rounded-xl min-h-[260px] flex flex-col items-center justify-center overflow-hidden border border-gray-800">
            {scanning ? (
              <div id={qrRegionId} className="w-full h-full text-white"></div>
            ) : (
              <div className="p-6 text-center space-y-3">
                <QrCode className="w-16 h-16 text-gray-400 mx-auto animate-bounce" />
                <p className="text-xs text-gray-300 max-w-xs">
                  Click below to activate your camera and scan delegate QR code.
                </p>
                <button
                  onClick={startCameraScanner}
                  className="redBg text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mx-auto"
                >
                  <QrCode className="w-4 h-4" /> Start Camera Scanner
                </button>
              </div>
            )}
          </div>

          {cameraError && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg text-left">
              {cameraError}
            </div>
          )}

          {/* Manual Input Form */}
          <form onSubmit={handleManualSubmit} className="pt-2 flex gap-2">
            <input
              type="text"
              placeholder="Or enter Token string (e.g. ESUMMIT-...)"
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#C0202A]"
            />
            <button
              type="submit"
              disabled={loading || !manualToken.trim()}
              className="navyBg text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Verify
            </button>
          </form>
        </div>

        {/* Verification Result Card */}
        {loading && (
          <div className="bg-white border border-gray-200 p-6 rounded-xl text-center space-y-2 shadow">
            <RefreshCw className="w-8 h-8 text-[#C0202A] animate-spin mx-auto" />
            <span className="text-sm font-semibold text-[#0E2044]">Validating QR token with database...</span>
          </div>
        )}

        {scanResult && !loading && (
          <div className={`border rounded-2xl p-6 shadow-xl space-y-4 animate-fadeIn ${
            scanResult.status === 'success' 
              ? 'bg-green-50 border-green-300 text-green-900' 
              : scanResult.status === 'duplicate'
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-red-50 border-red-300 text-red-900'
          }`}>
            <div className="flex items-center gap-3">
              {scanResult.status === 'success' && <CheckCircle2 className="w-8 h-8 text-green-600 shrink-0" />}
              {scanResult.status === 'duplicate' && <ShieldAlert className="w-8 h-8 text-amber-600 shrink-0" />}
              {scanResult.status === 'error' && <XCircle className="w-8 h-8 text-red-600 shrink-0" />}
              
              <div>
                <h3 className="text-lg font-bold">
                  {scanResult.status === 'success' && 'CHECK-IN VERIFIED'}
                  {scanResult.status === 'duplicate' && 'DUPLICATE CHECK-IN DETECTED'}
                  {scanResult.status === 'error' && 'INVALID TICKET SCAN'}
                </h3>
                <p className="text-xs opacity-90">
                  {scanResult.status === 'success' && 'Delegate verified for event entry.'}
                  {scanResult.status !== 'success' && (scanResult.message || 'Ticket signature verification failed.')}
                </p>
              </div>
            </div>

            {scanResult.status === 'success' && scanResult.data && (
              <div className="bg-white/80 p-4 rounded-xl border border-green-200 text-xs text-gray-800 space-y-1">
                <p><span className="font-bold text-[#0E2044]">Delegate:</span> {scanResult.data.user?.name}</p>
                <p><span className="font-bold text-[#0E2044]">Email:</span> {scanResult.data.user?.email}</p>
                <p><span className="font-bold text-[#0E2044]">Type:</span> {scanResult.data.user?.isTCET ? 'TCET Student/Staff (FREE)' : 'External Delegate'}</p>
                <p><span className="font-bold text-[#0E2044]">Check-In Time:</span> {new Date().toLocaleTimeString()}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerScanner;
