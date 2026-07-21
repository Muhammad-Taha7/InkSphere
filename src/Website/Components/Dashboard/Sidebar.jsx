import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, FileText, PlusSquare, Settings, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from "../../Store/Slices/authSlice.jsx";
import { useNavigate } from 'react-router-dom';

export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user } = useSelector(state => state.auth);
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
    { name: 'Settings & Notifications', path: '/profile/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-6 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 transition-colors duration-300">
      <div>
        {/* User Info */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border border-gray-200 dark:border-zinc-800 p-1">
            <img
              src={user?.avatar || 'https://via.placeholder.com/150'}
              alt={user?.name}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">{user?.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">@{user?.username}</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setIsMobileOpen?.(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-yellow-400 text-black shadow-sm'
                      : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white'
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

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-650 dark:hover:text-red-400 cursor-pointer"
      >
        <LogOut className="h-5 w-5" />
        Logout
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 shrink-0 border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 md:block">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setIsMobileOpen(false)}>
          <aside
            className="fixed bottom-0 left-0 top-0 z-50 w-72 border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
