import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, FileText, PlusSquare, Settings, LogOut, X, Bell } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice.jsx';

export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navItems = [
    { name: 'My Profile', path: '/profile', icon: User, end: true },
    { name: 'My Blogs', path: '/profile/my-blogs', icon: FileText },
    { name: 'Create Blog', path: '/profile/create', icon: PlusSquare },
    { name: 'Notifications', path: '/profile/notifications', icon: Bell },
    { name: 'Settings', path: '/profile/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-6 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 border-r border-gray-200 dark:border-zinc-800/80 transition-colors duration-300">
      
      {/* Top Container */}
      <div className="space-y-8">
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between md:hidden pb-2 border-b border-gray-100 dark:border-zinc-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
            Menu
          </span>
          <button
            onClick={() => setIsMobileOpen?.(false)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="flex flex-col items-center text-center pt-2">
          <div className="relative mb-3 group">
            <div className="h-20 w-20 rounded-full p-1 bg-gradient-to-tr from-yellow-500 via-amber-400 to-yellow-300 dark:from-yellow-500/80 dark:to-zinc-700 shadow-md">
              <img
                src={user?.avatar || 'https://via.placeholder.com/150'}
                alt={user?.name || 'User Avatar'}
                className="h-full w-full rounded-full object-cover border-2 border-white dark:border-zinc-900"
              />
            </div>
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900" />
          </div>

          <h3 className="font-bold text-gray-900 dark:text-white text-base tracking-wide truncate max-w-full">
            {user?.name || 'Guest User'}
          </h3>
          <p className="text-xs text-yellow-600 dark:text-yellow-500 font-medium truncate max-w-full mt-0.5">
            @{user?.username || 'username'}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-2">
            Overview
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setIsMobileOpen?.(false)}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-yellow-500 text-zinc-950 font-semibold shadow-md shadow-yellow-500/10 dark:shadow-yellow-500/5'
                      : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800/60 hover:text-gray-900 dark:hover:text-zinc-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? 'text-zinc-950' : 'text-gray-500 dark:text-zinc-400 group-hover:text-gray-900 dark:group-hover:text-zinc-200'
                      }`}
                    />
                    <span className="truncate">{item.name}</span>

                    {/* Active Accent Dot/Indicator for Dark Mode */}
                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-zinc-950" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="pt-4 border-t border-gray-100 dark:border-zinc-800/80">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 group cursor-pointer"
        >
          <LogOut className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span>Logout</span>
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden h-screen w-72 shrink-0 md:block sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Slide-in & Backdrop */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Drawer */}
          <aside className="fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};