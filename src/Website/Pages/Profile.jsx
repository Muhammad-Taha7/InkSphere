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
    <div className="max-w-2xl">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Profile Overview</h2>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-6">
          <img src={user?.avatar} alt={user?.name} className="h-24 w-24 rounded-full object-cover border-2 border-gray-100" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">{user?.name}</h3>
            <p className="text-yellow-600 font-medium">@{user?.username}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500 font-medium">Email</p>
            <p className="text-gray-900">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Location</p>
            <p className="text-gray-900">{user?.location || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Hobby</p>
            <p className="text-gray-900">{user?.hobby || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Website</p>
            <p className="text-gray-900">{user?.website || 'Not specified'}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-gray-500 font-medium">Bio</p>
            <p className="text-gray-900">{user?.bio || 'No bio added yet.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Profile = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-gray-50">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <main className="flex-1 overflow-x-hidden">
        {/* Mobile Header */}
        <div className="flex items-center gap-4 border-b border-gray-200 bg-white p-4 md:hidden">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="font-bold text-gray-900">Dashboard</h1>
        </div>

        <div className="p-6 md:p-8 lg:p-10">
          <Routes>
            <Route path="/" element={<ProfileOverview />} />
            <Route path="my-blogs" element={<MyBlogs />} />
            <Route path="create" element={<CreateBlog />} />
            <Route path="edit/:id" element={<EditBlog />} />
            <Route path="settings" element={
              <div className="max-w-2xl mx-auto md:mx-0">
                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-6">
                  <ProfileSetup isEditMode={true} />
                </div>
              </div>
            } />
          </Routes>
        </div>
      </main>
    </div>
  );
};
