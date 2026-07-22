import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar.jsx';
import { MyBlogs } from '../components/dashboard/MyBlogs.jsx';
import { CreateBlog } from './CreateBlog.jsx';
import { EditBlog } from './EditBlog.jsx';
import { Menu, Mail, MapPin, Heart, Globe, ExternalLink, Briefcase, Building2, Code2, Link as LinkIcon, ArrowLeft, Pencil } from 'lucide-react';
import { useSelector } from 'react-redux';
import { ProfileSetup } from './ProfileSetup.jsx';
import { Notifications } from '../components/dashboard/Notifications.jsx';
import { AccountSettings } from '../components/dashboard/AccountSettings.jsx';

// Full-width & Full-height Profile Overview Component with Edit Form merged below
const ProfileOverview = () => {
  const { user } = useSelector((state) => state.auth);

  const infoFields = [
    { icon: Mail, label: 'Email', value: user?.email },
    { icon: MapPin, label: 'Location', value: user?.location },
    { icon: Heart, label: 'Hobby', value: user?.hobby },
    {
      icon: Globe,
      label: 'Website',
      value: user?.website,
      isLink: true,
    },
    { icon: Briefcase, label: 'Job Title', value: user?.jobTitle },
    { icon: Building2, label: 'Company', value: user?.company },
    {
      icon: Code2,
      label: 'Github',
      value: user?.githubUrl,
      isLink: true,
    },
    {
      icon: LinkIcon,
      label: 'LinkedIn',
      value: user?.linkedinUrl,
      isLink: true,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-6">
      {/* Main Header Card - Spans full width */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm">
        {/* Background Accent Glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-48 w-48 rounded-full bg-yellow-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full">
          <div className="relative shrink-0">
            <img
              src={user?.avatar || 'https://via.placeholder.com/150'}
              alt={user?.name || 'User Avatar'}
              className="h-28 w-28 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-md"
            />
            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900" />
          </div>

          <div className="text-center sm:text-left space-y-2 flex-1 w-full">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {user?.name || 'User Name'}
              </h3>
              <p className="text-yellow-600 dark:text-yellow-500 font-semibold text-base">
                @{user?.username || 'username'}
              </p>
            </div>

            {/* Bio Section */}
            <p className="text-gray-600 dark:text-zinc-300 text-sm leading-relaxed w-full pt-2">
              {user?.bio || 'No bio added yet. Tell the world a little about yourself!'}
            </p>
          </div>
        </div>
      </div>

      {/* Details Grid - Full Width Responsive Grid */}
      <div className="flex-1 w-full rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-zinc-800 pb-3">
          Personal Details
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {infoFields.map((field, index) => {
            const Icon = field.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800/60 w-full"
              >
                <div className="p-2.5 rounded-lg bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                    {field.label}
                  </p>
                  {field.isLink && field.value ? (
                    <a
                      href={field.value.startsWith('http') ? field.value : `https://${field.value}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-yellow-600 dark:text-yellow-500 hover:underline inline-flex items-center gap-1 truncate max-w-full"
                    >
                      {field.value}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-zinc-100 truncate">
                      {field.value || 'Not specified'}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Profile Section — Merged Below */}
      <div className="w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-500">
            <Pencil className="h-5 w-5" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Edit Your Profile
          </h4>
        </div>
        <ProfileSetup isEditMode={true} />
      </div>
    </div>
  );
};

export const Profile = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    // Uses full viewport height (h-screen) and width (w-full)
    <div className="flex h-screen w-full bg-gray-50 dark:bg-zinc-950 transition-colors duration-300 overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Area filling remaining height & width */}
      <main className="flex-1 flex flex-col h-full w-full overflow-y-auto">
        {/* Top Header Bar — Desktop & Mobile */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-4 py-3 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors md:hidden"
              aria-label="Open Menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Back to Home Button */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-zinc-100 transition-all duration-200 group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">Back to Home</span>
            </button>
          </div>

          <h1 className="font-bold text-gray-900 dark:text-white text-lg">Dashboard</h1>

          {/* Spacer for balance */}
          <div className="w-24" />
        </div>

        {/* Dynamic Route Container - Expanded to 100% width */}
        <div className="flex-1 w-full p-4 sm:p-6 md:p-8">
          <Routes>
            <Route path="/" element={<ProfileOverview />} />
            <Route path="my-blogs" element={<MyBlogs />} />
            <Route path="create" element={<CreateBlog />} />
            <Route path="edit/:id" element={<EditBlog />} />
            <Route path="notifications" element={<Notifications />} />
            <Route
              path="settings"
              element={<AccountSettings />}
            />
          </Routes>
        </div>
      </main>
    </div>
  );
};