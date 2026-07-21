import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardStats, fetchAllUsers, toggleUserBlock } from '../../Store/Slices/adminSlice.jsx';
import {
  Users, FileText, CheckCircle, Heart, MessageSquare,
  Eye, Search, ShieldAlert, ShieldCheck, Mail, LayoutList
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import ConfirmModal from '../../Components/ConfirmModal.jsx';

export const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stats, isLoadingStats, users, isLoadingUsers } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const [blockModal, setBlockModal] = useState({ isOpen: false, user: null });

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleToggleBlock = () => {
    if (blockModal.user) {
      dispatch(toggleUserBlock(blockModal.user._id));
    }
    setBlockModal({ isOpen: false, user: null });
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Loading state
  if (isLoadingStats && !stats) {
    return (
      <div className="adm-loading">
        <div className="adm-loading-spinner"></div>
      </div>
    );
  }

  const statCards = stats ? [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
    { title: 'Total Blogs', value: stats.totalBlogs, icon: FileText, gradient: 'linear-gradient(135deg, #FACC15, #EAB308)' },
    { title: 'Published', value: stats.publishedBlogs, icon: CheckCircle, gradient: 'linear-gradient(135deg, #22c55e, #16a34a)' },
    { title: 'Total Likes', value: stats.totalLikes, icon: Heart, gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
    { title: 'Comments', value: stats.totalComments, icon: MessageSquare, gradient: 'linear-gradient(135deg, #a855f7, #9333ea)' },
  ] : [];

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedGrowth = stats?.userGrowth?.map(item => ({
    name: monthNames[item._id - 1],
    users: item.count
  })) || [];

  return (
    <div className="adm-dashboard">
      {/* Header */}
      <div className="adm-dash-header">
        <div>
          <h1 className="adm-dash-title">Dashboard</h1>
          <p className="adm-dash-subtitle">Overview of your platform's activity</p>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="adm-stats-grid">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="adm-stat-card" style={{ animationDelay: `${index * 0.08}s` }}>
                <div className="adm-stat-icon" style={{ background: stat.gradient }}>
                  <Icon size={20} color="#fff" />
                </div>
                <div className="adm-stat-info">
                  <span className="adm-stat-value">{stat.value}</span>
                  <span className="adm-stat-label">{stat.title}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Chart */}
      {formattedGrowth.length > 0 && (
        <div className="adm-chart-card">
          <h3 className="adm-chart-title">User Growth</h3>
          <div className="adm-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminChartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FACC15" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FACC15" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#5a5a6e', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5a5a6e', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: '#1a1a28',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    color: '#fafafa'
                  }}
                  itemStyle={{ color: '#FACC15', fontWeight: 'bold' }}
                  labelStyle={{ color: '#8b8b9e' }}
                />
                <Area type="monotone" dataKey="users" stroke="#FACC15" strokeWidth={2.5} fillOpacity={1} fill="url(#adminChartGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Users Section */}
      <div className="adm-users-section">
        <div className="adm-users-header">
          <h3 className="adm-users-title">
            All Users
            <span className="adm-users-count">{users.length}</span>
          </h3>
          <div className="adm-search-wrap">
            <Search size={16} className="adm-search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="adm-search-input"
            />
          </div>
        </div>

        {isLoadingUsers && users.length === 0 ? (
          <div className="adm-loading" style={{ height: '200px' }}>
            <div className="adm-loading-spinner"></div>
          </div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Status</th>
                  <th>Role</th>
                  <th style={{ textAlign: 'center' }}>Blogs</th>
                  <th style={{ textAlign: 'center' }}>Joined</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="adm-user-cell">
                          <div className="adm-user-avatar">
                            <img
                              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=FACC15&color=000&bold=true`}
                              alt={user.name}
                            />
                          </div>
                          <div>
                            <div className="adm-user-name">{user.name}</div>
                            <div className="adm-user-email">
                              <Mail size={12} />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="adm-status-badges">
                          <span className={`adm-badge ${user.isVerified ? 'adm-badge-green' : 'adm-badge-gray'}`}>
                            {user.isVerified ? 'Verified' : 'Unverified'}
                          </span>
                          {user.isBlocked && (
                            <span className="adm-badge adm-badge-red">Blocked</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`adm-badge ${user.role === 'admin' ? 'adm-badge-yellow' : 'adm-badge-dim'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="adm-blog-count">
                          <LayoutList size={14} />
                          {user.blogCount || 0}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="adm-date">
                          {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="adm-actions">
                          <button
                            onClick={() => navigate(`/run/Dashboard/user/${user._id}`)}
                            className="adm-action-btn adm-action-view"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => setBlockModal({ isOpen: true, user })}
                              className={`adm-action-btn ${user.isBlocked ? 'adm-action-unblock' : 'adm-action-block'}`}
                              title={user.isBlocked ? 'Unblock' : 'Block'}
                            >
                              {user.isBlocked ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="adm-empty">
                      No users found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={blockModal.isOpen}
        title={blockModal.user?.isBlocked ? "Unblock User" : "Block User"}
        message={`Are you sure you want to ${blockModal.user?.isBlocked ? "unblock" : "block"} ${blockModal.user?.name}? ${!blockModal.user?.isBlocked ? "They will no longer be able to log in or publish blogs." : ""}`}
        confirmText={blockModal.user?.isBlocked ? "Unblock" : "Block"}
        isDestructive={!blockModal.user?.isBlocked}
        onConfirm={handleToggleBlock}
        onCancel={() => setBlockModal({ isOpen: false, user: null })}
      />

      <style>{`
        .adm-dashboard {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* ===== HEADER ===== */
        .adm-dash-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .adm-dash-title {
          font-size: 28px;
          font-weight: 800;
          color: #fafafa;
          margin: 0;
        }

        .adm-dash-subtitle {
          color: #5a5a6e;
          font-size: 14px;
          margin-top: 4px;
        }

        /* ===== LOADING ===== */
        .adm-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 250px;
        }

        .adm-loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255,255,255,0.06);
          border-top-color: #FACC15;
          border-radius: 50%;
          animation: admSpin 0.6s linear infinite;
        }

        @keyframes admSpin {
          to { transform: rotate(360deg); }
        }

        /* ===== STATS GRID ===== */
        .adm-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
          gap: 16px;
        }

        .adm-stat-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 20px;
          background: #0f0f18;
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 14px;
          transition: all 0.3s ease;
          animation: admFadeUp 0.5s ease forwards;
          opacity: 0;
        }

        .adm-stat-card:hover {
          border-color: rgba(255,255,255,0.08);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }

        @keyframes admFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .adm-stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .adm-stat-info {
          display: flex;
          flex-direction: column;
        }

        .adm-stat-value {
          font-size: 24px;
          font-weight: 800;
          color: #fafafa;
          line-height: 1;
        }

        .adm-stat-label {
          font-size: 12px;
          color: #5a5a6e;
          margin-top: 4px;
          font-weight: 500;
        }

        /* ===== CHART ===== */
        .adm-chart-card {
          background: #0f0f18;
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 14px;
          padding: 24px;
        }

        .adm-chart-title {
          font-size: 16px;
          font-weight: 700;
          color: #fafafa;
          margin: 0 0 16px;
        }

        .adm-chart-container {
          height: 260px;
          width: 100%;
        }

        /* ===== USERS SECTION ===== */
        .adm-users-section {
          background: #0f0f18;
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 14px;
          overflow: hidden;
        }

        .adm-users-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .adm-users-title {
          font-size: 16px;
          font-weight: 700;
          color: #fafafa;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .adm-users-count {
          background: rgba(250,204,21,0.1);
          color: #FACC15;
          padding: 2px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .adm-search-wrap {
          position: relative;
          width: 260px;
          max-width: 100%;
        }

        .adm-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #4a4a5e;
        }

        .adm-search-input {
          width: 100%;
          padding: 10px 14px 10px 36px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          color: #fafafa;
          font-size: 13px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }

        .adm-search-input:focus {
          border-color: rgba(250,204,21,0.3);
        }

        .adm-search-input::placeholder {
          color: #3a3a4e;
        }

        /* ===== TABLE ===== */
        .adm-table-wrap {
          overflow-x: auto;
        }

        .adm-table {
          width: 100%;
          text-align: left;
          border-collapse: collapse;
        }

        .adm-table thead tr {
          border-top: 1px solid rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        .adm-table th {
          padding: 12px 24px;
          font-size: 11px;
          font-weight: 600;
          color: #4a4a5e;
          text-transform: uppercase;
          letter-spacing: 1px;
          white-space: nowrap;
        }

        .adm-table td {
          padding: 14px 24px;
          font-size: 13px;
          color: #a0a0b4;
          border-bottom: 1px solid rgba(255,255,255,0.02);
          white-space: nowrap;
        }

        .adm-table tbody tr {
          transition: background 0.15s;
        }

        .adm-table tbody tr:hover {
          background: rgba(255,255,255,0.015);
        }

        /* ===== USER CELL ===== */
        .adm-user-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .adm-user-avatar {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }

        .adm-user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .adm-user-name {
          font-weight: 600;
          color: #e0e0ec;
          font-size: 13px;
        }

        .adm-user-email {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #4a4a5e;
          margin-top: 2px;
        }

        /* ===== BADGES ===== */
        .adm-status-badges {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .adm-badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          width: fit-content;
        }

        .adm-badge-green {
          background: rgba(34,197,94,0.1);
          color: #4ade80;
        }

        .adm-badge-gray {
          background: rgba(255,255,255,0.04);
          color: #5a5a6e;
        }

        .adm-badge-red {
          background: rgba(239,68,68,0.1);
          color: #f87171;
        }

        .adm-badge-yellow {
          background: rgba(250,204,21,0.1);
          color: #FACC15;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .adm-badge-dim {
          background: rgba(255,255,255,0.03);
          color: #5a5a6e;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .adm-blog-count {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #8b8b9e;
          font-weight: 600;
          font-size: 13px;
        }

        .adm-date {
          color: #4a4a5e;
          font-size: 12px;
        }

        /* ===== ACTIONS ===== */
        .adm-actions {
          display: flex;
          gap: 6px;
          justify-content: flex-end;
        }

        .adm-action-btn {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .adm-action-view {
          color: #60a5fa;
        }

        .adm-action-view:hover {
          background: rgba(96,165,250,0.1);
          border-color: rgba(96,165,250,0.2);
        }

        .adm-action-block {
          color: #f87171;
        }

        .adm-action-block:hover {
          background: rgba(248,113,113,0.1);
          border-color: rgba(248,113,113,0.2);
        }

        .adm-action-unblock {
          color: #4ade80;
        }

        .adm-action-unblock:hover {
          background: rgba(74,222,128,0.1);
          border-color: rgba(74,222,128,0.2);
        }

        .adm-empty {
          text-align: center !important;
          padding: 48px 24px !important;
          color: #4a4a5e !important;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 640px) {
          .adm-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .adm-dash-title {
            font-size: 22px;
          }

          .adm-users-header {
            padding: 16px;
          }

          .adm-table th, .adm-table td {
            padding: 10px 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
