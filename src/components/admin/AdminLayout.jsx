import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Settings, LogOut, 
  Menu, X, Shield, ShieldAlert 
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogout } from '../../store/slices/adminSlice.jsx';

export const AdminLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { adminToken, adminUser } = useSelector((state) => state.admin);
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
    { name: 'Dashboard', icon: LayoutDashboard, path: '/run/Dashboard/home', end: true },
    { name: 'All Users', icon: Users, path: '/run/Dashboard/users', end: false },
    { name: 'Blocked Users', icon: ShieldAlert, path: '/run/Dashboard/blocked', end: false },
    { name: 'Support Queries', icon: Shield, path: '/run/Dashboard/queries', end: false },
    { name: 'Settings', icon: Settings, path: '/run/Dashboard/settings', end: false }
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-6">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md shadow-yellow-500/20">
            <Shield size={20} />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-wider m-0 leading-tight">
              INKSPHERE <span className="text-yellow-600">ADMIN</span>
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">{adminUser?.name || 'Administrator'}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 my-4" />

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-yellow-50 text-yellow-800 font-semibold border border-yellow-200/60 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
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
      <div>
        <div className="h-px bg-slate-100 my-4" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Mobile Header */}
      <div className="flex md:hidden fixed top-0 left-0 right-0 z-30 items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center text-white">
            <Shield size={16} />
          </div>
          <span className="text-xs font-extrabold text-slate-900 tracking-wider">
            INKSPHERE <span className="text-yellow-600">ADMIN</span>
          </span>
        </div>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-slate-500 p-1">
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 bg-white border-r border-slate-200 fixed top-0 left-0 bottom-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)}>
          <aside className="fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-slate-200 z-51 shadow-xl animate-in slide-in-from-left duration-200" onClick={(e) => e.stopPropagation()}>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 pt-20 md:p-8 md:ml-64 overflow-y-auto">
        <div className="">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;