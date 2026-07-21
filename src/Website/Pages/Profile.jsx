import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from '../Components/Dashboard/Sidebar.jsx';
import { MyBlogs } from '../Components/Dashboard/MyBlogs.jsx';
import { CreateBlog } from './CreateBlog.jsx';
import { EditBlog } from './EditBlog.jsx';
import { Menu } from 'lucide-react';
import { useSelector } from 'react-redux';
import { ProfileSetup } from './ProfileSetup.jsx';

// Placeholder components for Settings/Profile overview
const ProfileOverview = () => {
  const { user } = useSelector(state => state.auth);
  return (
    <div className="max-w-4xl">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Profile Overview</h2>
      <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-6">
          <img src={user?.avatar || 'https://via.placeholder.com/150'} alt={user?.name} className="h-24 w-24 rounded-full object-cover border-2 border-gray-100 dark:border-zinc-800" />
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h3>
            <p className="text-yellow-600 dark:text-yellow-500 font-medium">@{user?.username}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">Email</p>
            <p className="text-gray-900 dark:text-zinc-100">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">Location</p>
            <p className="text-gray-900 dark:text-zinc-100">{user?.location || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">Hobby</p>
            <p className="text-gray-900 dark:text-zinc-100">{user?.hobby || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">Website</p>
            <p className="text-gray-900 dark:text-zinc-100">{user?.website || 'Not specified'}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">Bio</p>
            <p className="text-gray-900 dark:text-zinc-100 leading-relaxed">{user?.bio || 'No bio added yet.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Profile = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <main className="flex-1 overflow-x-hidden">
        {/* Mobile Header */}
        <div className="flex items-center gap-4 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 md:hidden">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="font-bold text-gray-900 dark:text-white">Dashboard</h1>
        </div>

        <div className="p-6 md:p-8 lg:p-10">
          <Routes>
            <Route path="/" element={<ProfileOverview />} />
            <Route path="my-blogs" element={<MyBlogs />} />
            <Route path="create" element={<CreateBlog />} />
            <Route path="edit/:id" element={<EditBlog />} />
            <Route path="settings" element={
              <div className="max-w-4xl mx-auto md:mx-0">
                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
                <ProfileSetup isEditMode={true} />
              </div>
            } />
          </Routes>
        </div>
      </main>
    </div>
  );
};
