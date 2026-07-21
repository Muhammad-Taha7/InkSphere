import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Settings, LogOut, Menu, X, Shield } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogout } from '../../Store/Slices/adminSlice.jsx';

export const AdminLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { adminToken, adminUser } = useSelector(state => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminToken) {
      navigate('/run/Dashboard', { replace: true });
    }
  }, [adminToken, navigate]);

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate('/run/Dashboard', { replace: true });
  };

  if (!adminToken) return null;

  const navItems = [
    { name: 'Dashboard', path: '/run/Dashboard/home', icon: LayoutDashboard, end: true },
    { name: 'Settings', path: '/run/Dashboard/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="adm-sidebar-inner">
      <div>
        {/* Logo */}
        <div className="adm-sidebar-logo">
          <div className="adm-sidebar-shield">
            <Shield size={20} />
          </div>
          <div>
            <h2 className="adm-sidebar-brand">
              INKSPHERE <span className="adm-sidebar-brand-accent">ADMIN</span>
            </h2>
            <p className="adm-sidebar-welcome">{adminUser?.name || 'Administrator'}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="adm-sidebar-divider"></div>

        {/* Navigation */}
        <nav className="adm-sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `adm-sidebar-link ${isActive ? 'adm-sidebar-link-active' : ''}`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div className="adm-sidebar-bottom">
        <div className="adm-sidebar-divider"></div>
        <button onClick={handleLogout} className="adm-sidebar-logout">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="adm-layout">
      {/* Mobile Header */}
      <div className="adm-mobile-header">
        <div className="adm-mobile-header-left">
          <div className="adm-mobile-shield">
            <Shield size={16} />
          </div>
          <span className="adm-mobile-brand">
            INKSPHERE <span className="adm-sidebar-brand-accent">ADMIN</span>
          </span>
        </div>
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)} 
          className="adm-mobile-toggle"
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="adm-sidebar">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="adm-mobile-overlay" onClick={() => setIsMobileOpen(false)}>
          <aside
            className="adm-mobile-sidebar"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="adm-main">
        <div className="adm-main-inner">
          <Outlet />
        </div>
      </main>

      <style>{`
        .adm-layout {
          display: flex;
          min-height: 100vh;
          background: #08080d;
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
        }

        /* ===== SIDEBAR ===== */
        .adm-sidebar {
          display: none;
          width: 260px;
          flex-shrink: 0;
          background: #0c0c14;
          border-right: 1px solid rgba(255,255,255,0.04);
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 40;
        }

        @media (min-width: 768px) {
          .adm-sidebar {
            display: block;
          }
        }

        .adm-sidebar-inner {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          padding: 28px 16px;
          overflow-y: auto;
        }

        .adm-sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 8px;
          margin-bottom: 24px;
        }

        .adm-sidebar-shield {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #FACC15, #EAB308);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #06060b;
          flex-shrink: 0;
        }

        .adm-sidebar-brand {
          font-size: 14px;
          font-weight: 900;
          color: #fafafa;
          letter-spacing: 2px;
          margin: 0;
          line-height: 1.2;
        }

        .adm-sidebar-brand-accent {
          color: #FACC15;
        }

        .adm-sidebar-welcome {
          font-size: 11px;
          color: #5a5a6e;
          margin: 2px 0 0;
        }

        .adm-sidebar-divider {
          height: 1px;
          background: rgba(255,255,255,0.04);
          margin: 8px 0 16px;
        }

        .adm-sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .adm-sidebar-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          color: #6b6b80;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .adm-sidebar-link:hover {
          color: #a0a0b4;
          background: rgba(255,255,255,0.03);
        }

        .adm-sidebar-link-active {
          color: #06060b !important;
          background: linear-gradient(135deg, #FACC15, #EAB308) !important;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(250,204,21,0.2);
        }

        .adm-sidebar-bottom {
          padding-top: 8px;
        }

        .adm-sidebar-logout {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 11px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          color: #ef4444;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
        }

        .adm-sidebar-logout:hover {
          background: rgba(239,68,68,0.08);
          color: #f87171;
        }

        /* ===== MOBILE HEADER ===== */
        .adm-mobile-header {
          display: flex;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 30;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: rgba(12,12,20,0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        @media (min-width: 768px) {
          .adm-mobile-header {
            display: none;
          }
        }

        .adm-mobile-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .adm-mobile-shield {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #FACC15, #EAB308);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #06060b;
        }

        .adm-mobile-brand {
          font-size: 13px;
          font-weight: 800;
          color: #fafafa;
          letter-spacing: 2px;
        }

        .adm-mobile-toggle {
          background: none;
          border: none;
          color: #8b8b9e;
          cursor: pointer;
          padding: 4px;
        }

        /* ===== MOBILE OVERLAY ===== */
        .adm-mobile-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
        }

        @media (min-width: 768px) {
          .adm-mobile-overlay {
            display: none;
          }
        }

        .adm-mobile-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 260px;
          background: #0c0c14;
          border-right: 1px solid rgba(255,255,255,0.04);
          z-index: 51;
          animation: admSlideIn 0.25s ease;
        }

        @keyframes admSlideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }

        /* ===== MAIN CONTENT ===== */
        .adm-main {
          flex: 1;
          padding: 24px;
          padding-top: 72px;
          overflow-y: auto;
        }

        @media (min-width: 768px) {
          .adm-main {
            margin-left: 260px;
            padding: 32px;
            padding-top: 32px;
          }
        }

        .adm-main-inner {
          max-width: 1200px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
