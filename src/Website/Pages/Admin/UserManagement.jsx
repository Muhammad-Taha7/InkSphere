import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, toggleUserBlock } from '../../Store/Slices/adminSlice.jsx';
import { Search, ShieldAlert, ShieldCheck, Mail, Calendar, LayoutList } from 'lucide-react';
import ConfirmModal from '../../Components/ConfirmModal.jsx';

export const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, isLoadingUsers } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const [blockModal, setBlockModal] = useState({ isOpen: false, user: null });

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleToggleBlock = () => {
    if (blockModal.user) {
      dispatch(toggleUserBlock(blockModal.user._id));
    }
    setBlockModal({ isOpen: false, user: null });
  };

  const openBlockModal = (user) => {
    if (user.role === 'admin') return; // Cannot block admin
    setBlockModal({ isOpen: true, user });
  };

  const filteredUsers = users.filter((user) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoadingUsers && users.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-500">View and manage all registered users.</p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-center">Blogs</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-200">
                          <img
                            src={user.avatar || 'https://via.placeholder.com/150'}
                            alt={user.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{user.name}</div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Mail className="h-3 w-3" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          user.isVerified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {user.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                        {user.isBlocked && (
                          <span className="inline-flex w-fit items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                            Blocked
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide ${
                        user.role === 'admin' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
                        <LayoutList className="h-3.5 w-3.5" />
                        {user.blogCount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => openBlockModal(user)}
                          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                            user.isBlocked
                              ? 'bg-green-50 text-green-600 hover:bg-green-100'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          {user.isBlocked ? (
                            <>
                              <ShieldCheck className="h-4 w-4" /> Unblock
                            </>
                          ) : (
                            <>
                              <ShieldAlert className="h-4 w-4" /> Block
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No users found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal 
        isOpen={blockModal.isOpen}
        title={blockModal.user?.isBlocked ? "Unblock User" : "Block User"}
        message={`Are you sure you want to ${blockModal.user?.isBlocked ? "unblock" : "block"} ${blockModal.user?.name}? ${!blockModal.user?.isBlocked ? "They will no longer be able to log in or publish blogs." : ""}`}
        confirmText={blockModal.user?.isBlocked ? "Unblock" : "Block"}
        isDestructive={!blockModal.user?.isBlocked}
        onConfirm={handleToggleBlock}
        onCancel={() => setBlockModal({ isOpen: false, user: null })}
      />
    </div>
  );
};

export default UserManagement;
