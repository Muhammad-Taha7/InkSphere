import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAdminCredentials, clearAdminError } from '../../store/slices/adminSlice.jsx';
import { Shield, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AdminSettings = () => {
  const dispatch = useDispatch();
  const { adminUser, isUpdatingCredentials, error } = useSelector((state) => state.admin);

  const [newUsername, setNewUsername] = useState(adminUser?.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [localSuccess, setLocalSuccess] = useState(false);

  useEffect(() => {
    dispatch(clearAdminError());
    setLocalError('');
    setLocalSuccess(false);
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLocalSuccess(false);

    if (!currentPassword) {
      setLocalError('Current password is required to verify changes.');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setLocalError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setLocalError('New password and confirmation do not match.');
      return;
    }

    const result = await dispatch(updateAdminCredentials({
      currentPassword,
      newPassword: newPassword || undefined,
      newUsername: newUsername !== adminUser?.username ? newUsername : undefined
    }));

    if (updateAdminCredentials.fulfilled.match(result)) {
      setLocalSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Admin Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your administrator username and password</p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 max-w-2xl shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="text-yellow-600" />
          <h2 className="text-lg font-bold text-slate-900">Security Credentials</h2>
        </div>

        {/* Message banners */}
        {localError && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl text-xs font-medium bg-red-50 border border-red-200 text-red-600 mb-6">
            <AlertCircle size={16} />
            <span>{localError}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl text-xs font-medium bg-red-50 border border-red-200 text-red-600 mb-6">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {localSuccess && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl text-xs font-medium bg-green-50 border border-green-200 text-green-600 mb-6">
            <CheckCircle2 size={16} />
            <span>Credentials updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Admin Email (Read-Only)</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={adminUser?.email || 'admin@inksphere.com'}
                disabled
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-slate-400">Admin email address cannot be changed.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Admin Username</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Admin"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400">Username must be 3-30 characters, alphanumeric & underscores only.</p>
          </div>

          <div className="h-px bg-slate-100 my-1" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="Leave blank to keep same"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 my-1" />

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Current Password (Required)</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                placeholder="Enter current password to save changes"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-red-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400">To update any credentials, you must confirm your current admin password.</p>
          </div>

          <button
            type="submit"
            disabled={isUpdatingCredentials}
            className="self-start px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold text-xs rounded-xl shadow-md shadow-yellow-500/20 hover:shadow-lg hover:shadow-yellow-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 transition-all"
          >
            {isUpdatingCredentials ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;