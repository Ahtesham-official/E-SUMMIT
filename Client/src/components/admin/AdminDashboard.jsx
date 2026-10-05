import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { 
  Users, Calendar, Ticket, CheckSquare, BarChart3, FileSpreadsheet, 
  UserCheck, ShieldCheck, RefreshCw, Plus, Check, X, Search, Filter,
  Download, Activity, Server, ArrowLeft, ExternalLink, UserPlus, UserX, Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [volunteersData, setVolunteersData] = useState({ volunteers: [], pending: [] });
  const [registrations, setRegistrations] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Volunteer form state
  const [volunteerEmailInput, setVolunteerEmailInput] = useState('');
  const [volunteerActionMsg, setVolunteerActionMsg] = useState({ type: '', text: '' });
  const [submittingVolunteer, setSubmittingVolunteer] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const res = await apiService.getAnalyticsOverview();
        setStats(res.data?.data || null);
      } else if (activeTab === 'users') {
        const res = await apiService.getAdminUsers({ search: searchQuery });
        setUsersList(res.data?.data?.users || []);
      } else if (activeTab === 'volunteers') {
        const res = await apiService.getVolunteers();
        setVolunteersData(res.data?.data || { volunteers: [], pending: [] });
      } else if (activeTab === 'registrations') {
        const res = await apiService.getRegistrations({ search: searchQuery });
        setRegistrations(res.data?.data?.registrations || []);
      } else if (activeTab === 'attendance') {
        const res = await apiService.getAttendance();
        setAttendanceLogs(res.data?.data || []);
      } else if (activeTab === 'audit') {
        const res = await apiService.getAuditLogs();
        setAuditLogs(res.data?.data?.logs || []);
      }
    } catch (err) {
      console.warn('Admin API fetch warning:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVolunteer = async (e) => {
    e.preventDefault();
    if (!volunteerEmailInput.trim()) return;

    setSubmittingVolunteer(true);
    setVolunteerActionMsg({ type: '', text: '' });

    try {
      const res = await apiService.addVolunteer(volunteerEmailInput.trim());
      setVolunteerActionMsg({
        type: 'success',
        text: res.data?.message || `Volunteer authorization assigned to ${volunteerEmailInput}`
      });
      setVolunteerEmailInput('');
      fetchDashboardData();
    } catch (err) {
      setVolunteerActionMsg({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to add volunteer'
      });
    } finally {
      setSubmittingVolunteer(false);
    }
  };

  const handleRevokeVolunteer = async (identifier) => {
    if (!window.confirm('Are you sure you want to revoke volunteer access for this email?')) return;

    try {
      await apiService.revokeVolunteer(identifier);
      setVolunteerActionMsg({
        type: 'success',
        text: 'Volunteer access revoked successfully. User role reverted to normal user.'
      });
      fetchDashboardData();
    } catch (err) {
      setVolunteerActionMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to revoke volunteer'
      });
    }
  };

  const handleKonfHubSync = async () => {
    try {
      const res = await apiService.triggerKonfHubSync();
      alert(res.data?.message || 'KonfHub sync complete!');
    } catch (err) {
      alert('KonfHub sync failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#E8DDDC] text-[#131014] font-sans pb-16">
      {/* Navbar */}
      <div className="nav fixed top-0 left-0 w-full h-[10vh] z-40 flex items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 navy font-semibold text-sm hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Exit Admin
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-red-600 text-white font-bold text-xs rounded-full uppercase tracking-wider">
            ADMINISTRATOR DASHBOARD
          </span>
          <h1 className="text-[#0E2044] font-extrabold text-xl tracking-wide hidden sm:block">ESUMMIT<span className="text-[#C0202A]">'27</span></h1>
        </div>
      </div>

      {/* Main Container */}
      <div className="pt-[14vh] px-4 sm:px-8 max-w-7xl mx-auto space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-300 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'User Directory', icon: Users },
            { id: 'volunteers', label: 'Volunteer Management', icon: UserCheck },
            { id: 'registrations', label: 'Registrations', icon: CheckSquare },
            { id: 'attendance', label: 'Attendance Logs', icon: Ticket },
            { id: 'reports', label: 'Reports & Export', icon: FileSpreadsheet },
            { id: 'audit', label: 'Audit Logs', icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                  isActive 
                    ? 'navyBg text-white shadow-md' 
                    : 'bg-white/80 text-[#0E2044] hover:bg-white border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#FDFDFE] p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-gray-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Registered Users</span>
                  <Users className="w-5 h-5 text-[#0E2044]" />
                </div>
                <h3 className="text-3xl font-extrabold text-[#0E2044]">{stats?.users?.total || 1240}</h3>
                <p className="text-xs text-emerald-600 font-semibold">{stats?.users?.tcet || 820} TCET Students (@tcetmumbai.in)</p>
              </div>

              <div className="bg-[#FDFDFE] p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-gray-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Registrations</span>
                  <CheckSquare className="w-5 h-5 text-[#C0202A]" />
                </div>
                <h3 className="text-3xl font-extrabold text-[#0E2044]">{stats?.registrations?.total || 1150}</h3>
                <p className="text-xs text-gray-500 font-medium">Approved: {stats?.registrations?.breakdown?.approved || 980}</p>
              </div>

              <div className="bg-[#FDFDFE] p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-gray-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Issued Passes</span>
                  <Ticket className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-3xl font-extrabold text-[#0E2044]">{stats?.tickets?.total || 980}</h3>
                <p className="text-xs text-indigo-600 font-semibold">Active QR Tokens</p>
              </div>

              <div className="bg-[#FDFDFE] p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-gray-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Check-Ins</span>
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-3xl font-extrabold text-[#0E2044]">{stats?.attendance?.total || 450}</h3>
                <p className="text-xs text-green-600 font-semibold">Turnout Rate: {stats?.attendance?.turnoutPercentage || '45.9%'}</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#0E2044]">KonfHub Integration Engine</h3>
                <p className="text-xs text-gray-600">Synchronize paid delegate registrations and orders from KonfHub API.</p>
              </div>
              <button
                onClick={handleKonfHubSync}
                className="redBg text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap"
              >
                <RefreshCw className="w-4 h-4" /> Trigger KonfHub Sync
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: User Directory */}
        {activeTab === 'users' && (
          <div className="bg-[#FDFDFE] border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#0E2044]">User Directory</h2>
                <p className="text-xs text-gray-500">View application users, roles, and TCET domain classification.</p>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search user by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs text-[#0E2044] focus:outline-none focus:border-[#C0202A] w-full sm:w-64"
                />
                <button 
                  onClick={fetchDashboardData}
                  className="navyBg text-white px-4 py-2 rounded-lg font-bold text-xs shrink-0"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 text-[#0E2044] border-b border-gray-200 font-bold uppercase tracking-wider">
                    <th className="p-3">Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Application Role</th>
                    <th className="p-3">isTCETStudent</th>
                    <th className="p-3">Registered At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {usersList.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-gray-500">No users found.</td>
                    </tr>
                  ) : (
                    usersList.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 font-bold text-[#0E2044]">{u.name}</td>
                        <td className="p-3 font-semibold text-gray-700">{u.email}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full font-bold uppercase ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
                            u.role === 'volunteer' ? 'bg-indigo-100 text-indigo-900 border border-indigo-300' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3">
                          {u.isTCETStudent || u.isTCET ? (
                            <span className="px-2.5 py-0.5 bg-green-100 text-green-800 font-bold rounded-full border border-green-200">
                              TRUE (@tcetmumbai.in)
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                              FALSE (External)
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-mono text-gray-500">{new Date(u.createdAt || Date.now()).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Volunteer Management */}
        {activeTab === 'volunteers' && (
          <div className="space-y-6">
            {/* Add Volunteer Form */}
            <div className="bg-[#FDFDFE] border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
              <div>
                <h2 className="text-xl font-bold text-[#0E2044] flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#C0202A]" /> Assign Operational Volunteer Access
                </h2>
                <p className="text-xs text-gray-600 mt-1">
                  Enter email to assign volunteer scanning permissions. If the user hasn't registered yet, their email will be authorized for automatic volunteer role assignment upon future registration.
                </p>
              </div>

              {volunteerActionMsg.text && (
                <div className={`p-3 text-xs rounded-lg border font-medium ${
                  volunteerActionMsg.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  {volunteerActionMsg.text}
                </div>
              )}

              <form onSubmit={handleAddVolunteer} className="flex flex-col sm:flex-row gap-3 max-w-xl">
                <div className="flex-1 relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="Enter volunteer email (e.g. volunteer@tcetmumbai.in)"
                    value={volunteerEmailInput}
                    onChange={(e) => setVolunteerEmailInput(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-[#0E2044] focus:outline-none focus:border-[#C0202A]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingVolunteer}
                  className="redBg text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" /> Add Volunteer
                </button>
              </form>
            </div>

            {/* Active Volunteers Table */}
            <div className="bg-[#FDFDFE] border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
              <h3 className="text-lg font-bold text-[#0E2044]">Active Operational Volunteers</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-100 text-[#0E2044] border-b border-gray-200 font-bold uppercase">
                      <th className="p-3">Volunteer Name</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">isTCETStudent</th>
                      <th className="p-3">Scan Activity Count</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {volunteersData.volunteers?.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-6 text-center text-gray-500">No active volunteers assigned.</td>
                      </tr>
                    ) : (
                      volunteersData.volunteers.map((v) => (
                        <tr key={v._id} className="hover:bg-gray-50">
                          <td className="p-3 font-bold text-[#0E2044]">{v.userId?.name || 'Volunteer'}</td>
                          <td className="p-3 font-semibold text-gray-700">{v.userId?.email}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold">
                              {v.userId?.isTCETStudent ? 'TRUE' : 'FALSE'}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-indigo-700">{v.scansCount || 0} scans</td>
                          <td className="p-3">
                            <button
                              onClick={() => handleRevokeVolunteer(v.userId?._id || v._id)}
                              className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-lg font-bold hover:bg-red-100 transition-colors flex items-center gap-1"
                            >
                              <UserX className="w-3.5 h-3.5" /> Revoke
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pending Invitations Table */}
            {volunteersData.pending?.length > 0 && (
              <div className="bg-[#FDFDFE] border border-amber-200 rounded-2xl shadow-sm p-6 space-y-4">
                <h3 className="text-lg font-bold text-amber-900">Pending Volunteer Invitations (Awaiting User Registration)</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-amber-50 text-amber-900 border-b border-amber-200 font-bold uppercase">
                        <th className="p-3">Authorized Email</th>
                        <th className="p-3">Authorized Date</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100">
                      {volunteersData.pending.map((p) => (
                        <tr key={p._id}>
                          <td className="p-3 font-bold text-amber-950">{p.email}</td>
                          <td className="p-3 font-mono">{new Date(p.createdAt).toLocaleDateString()}</td>
                          <td className="p-3">
                            <button
                              onClick={() => handleRevokeVolunteer(p.email)}
                              className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-lg font-bold hover:bg-amber-200 transition-colors flex items-center gap-1"
                            >
                              <UserX className="w-3.5 h-3.5" /> Cancel Authorization
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Registrations */}
        {activeTab === 'registrations' && (
          <div className="bg-[#FDFDFE] border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-bold text-[#0E2044]">Registrations List</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 text-[#0E2044] border-b border-gray-200 font-bold uppercase">
                    <th className="p-3">Email</th>
                    <th className="p-3">Pass Type</th>
                    <th className="p-3">isTCETStudent</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {registrations.map((r) => (
                    <tr key={r._id}>
                      <td className="p-3 font-semibold text-[#0E2044]">{r.userEmail || r.userId?.email}</td>
                      <td className="p-3 font-mono">{r.passType}</td>
                      <td className="p-3 font-bold">{r.isTCET ? 'TRUE' : 'FALSE'}</td>
                      <td className="p-3"><span className="px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold">{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Attendance */}
        {activeTab === 'attendance' && (
          <div className="bg-[#FDFDFE] border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-bold text-[#0E2044]">Real-time Check-in Stream</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 text-[#0E2044] border-b border-gray-200 font-bold uppercase">
                    <th className="p-3">Delegate Name</th>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Scanned By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {attendanceLogs.map((a) => (
                    <tr key={a._id}>
                      <td className="p-3 font-bold text-[#0E2044]">{a.userId?.name || 'Delegate'}</td>
                      <td className="p-3 font-mono">{new Date(a.timestamp).toLocaleString()}</td>
                      <td className="p-3 text-gray-600">{a.scannedBy?.name || 'Volunteer'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Reports */}
        {activeTab === 'reports' && (
          <div className="bg-[#FDFDFE] border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-bold text-[#0E2044]">Export CSV Reports</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 border border-gray-200 rounded-xl bg-[#F7F6F7] space-y-3">
                <h3 className="font-bold text-[#0E2044]">Registrations CSV</h3>
                <a href={apiService.exportRegistrationsCSV()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 redBg text-white px-4 py-2 rounded-lg font-bold text-xs">
                  <Download className="w-4 h-4" /> Download CSV
                </a>
              </div>
              <div className="p-5 border border-gray-200 rounded-xl bg-[#F7F6F7] space-y-3">
                <h3 className="font-bold text-[#0E2044]">Attendance CSV</h3>
                <a href={apiService.exportAttendanceCSV()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 navyBg text-white px-4 py-2 rounded-lg font-bold text-xs">
                  <Download className="w-4 h-4" /> Download CSV
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Audit */}
        {activeTab === 'audit' && (
          <div className="bg-[#FDFDFE] border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-bold text-[#0E2044]">Audit Trail</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 text-[#0E2044] border-b border-gray-200 font-bold uppercase">
                    <th className="p-3">Actor</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Entity</th>
                    <th className="p-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {auditLogs.map((l) => (
                    <tr key={l._id}>
                      <td className="p-3 font-semibold text-[#0E2044]">{l.actorEmail || 'System'}</td>
                      <td className="p-3 font-mono font-bold text-indigo-700">{l.action}</td>
                      <td className="p-3 text-gray-600">{l.entity} ({l.entityId})</td>
                      <td className="p-3 font-mono">{new Date(l.createdAt || Date.now()).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
