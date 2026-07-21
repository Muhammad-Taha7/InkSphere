import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Menu, X, ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Store/Slices/authSlice.jsx';

export const AdminLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'User Management', path: '/admin/users', icon: Users },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-6">
      <div>
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-black text-gray-900 tracking-wider">INKSPHERE <span className="text-yellow-500">ADMIN</span></h2>
          <p className="mt-2 text-sm text-gray-500">Welcome, {user?.name}</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-yellow-400 text-black shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => navigate('/')}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Site
        </button>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between bg-white px-4 py-3 shadow-sm md:hidden">
        <h2 className="text-lg font-black text-gray-900">INKSPHERE <span className="text-yellow-500">ADMIN</span></h2>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-gray-600 hover:text-gray-900">
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden w-72 shrink-0 border-r border-gray-200 bg-white shadow-sm md:block">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden" onClick={() => setIsMobileOpen(false)}>
          <aside
            className="fixed bottom-0 left-0 top-0 z-50 w-72 border-r border-gray-200 bg-white transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 pt-20 md:p-8 md:pt-8">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
