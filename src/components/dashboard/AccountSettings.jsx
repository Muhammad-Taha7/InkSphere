import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Lock, Trash2, AlertTriangle, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../ConfirmModal.jsx';

export const AccountSettings = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [deleteForm, setDeleteForm] = useState({
    password: ''
  });
  
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      setPasswordLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const { data } = await axios.put(
        `${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000')}/api/users/change-password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        },
        config
      );

      setPasswordSuccess(data.message);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteAccount = async () => {
    setIsDeleteModalOpen(false);
    setDeleteError('');

    try {
      setDeleteLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          password: deleteForm.password
        }
      };
      
      await axios.delete(`${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000')}/api/users/account`, config);
      
      // Logout and redirect on success
      dispatch(logout());
      navigate('/');
    } catch (error) {
      setDeleteError(error.response?.data?.message || 'Failed to delete account');
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-3xl w-full mx-auto space-y-8">
      
      {/* Change Password Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-zinc-800 pb-4">
          <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-500">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Change Password</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400">Ensure your account is using a long, random password to stay secure.</p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          {passwordError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-600 dark:text-red-400">
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-sm text-green-600 dark:text-green-400">
                {passwordSuccess}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                required
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm text-gray-900 dark:text-zinc-100 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">New Password</label>
              <input
                type="password"
                name="newPassword"
                required
                minLength="6"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm text-gray-900 dark:text-zinc-100 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                minLength="6"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm text-gray-900 dark:text-zinc-100 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={passwordLoading}
                className="rounded-lg bg-yellow-400 px-6 py-2.5 text-sm font-bold text-black transition-colors hover:bg-yellow-500 disabled:opacity-50 flex items-center justify-center min-w-[140px]"
              >
                {passwordLoading ? (
                  <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </form>
      </div>

      {/* Delete Account Section */}
      <div className="bg-red-50/50 dark:bg-red-950/10 rounded-2xl border border-red-200 dark:border-red-900/30 p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-red-200 dark:border-red-900/30 pb-4">
          <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-600 dark:text-red-400">Delete Account</h3>
            <p className="text-sm text-red-500 dark:text-red-400/80">Permanently delete your account and all of its contents.</p>
          </div>
        </div>

        <div className="mb-6 text-sm text-red-600/80 dark:text-red-400/80">
          Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.
        </div>

        <form onSubmit={handleDeleteSubmit} className="space-y-5">
          {deleteError && (
            <div className="bg-white/50 dark:bg-black/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-600 dark:text-red-400">
              {deleteError}
            </div>
          )}

            <div>
              <label className="block text-sm font-semibold text-red-700 dark:text-red-300 mb-1.5">
                Confirm your password
              </label>
              <input
                type="password"
                name="password"
                required
                value={deleteForm.password}
                onChange={(e) => setDeleteForm({ password: e.target.value })}
                placeholder="Enter password to confirm"
                className="w-full max-w-md rounded-lg border border-red-300 dark:border-red-800/50 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-gray-900 dark:text-zinc-100 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-600"
              />
            </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={deleteLoading}
              className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {deleteLoading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete My Account
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone and you will lose all your data."
        confirmText="Yes, Delete My Account"
        isDestructive={true}
        onConfirm={confirmDeleteAccount}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
