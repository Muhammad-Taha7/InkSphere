import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllUsers, toggleUserBlock } from '../../store/slices/adminSlice.jsx';
import { Eye, Search, ShieldAlert, ShieldCheck, Mail, LayoutList } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal.jsx';

export const AdminUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">All Users</h1>
        <p className="text-sm text-slate-500 mt-1">Manage and view all registered users.</p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex flex-wrap items-center justify-between p-5 border-b border-slate-100 gap-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            Users List
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">{users.length}</span>
          </h3>
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
            />
          </div>
        </div>

        {isLoadingUsers && users.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-3 border-slate-200 border-t-yellow-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80">
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Blogs</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Joined</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=eab308&color=fff&bold=true`}
                            alt={user.name}
                            className="w-9 h-9 rounded-lg object-cover border border-slate-200"
                          />
                          <div>
                            <div className="text-xs font-semibold text-slate-900">{user.name}</div>
                            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                              <Mail size={12} />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold w-fit ${user.isVerified ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                            {user.isVerified ? 'Verified' : 'Unverified'}
                          </span>
                          {user.isBlocked && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-700 w-fit">
                              Blocked
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-600'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap text-center">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700">
                          <LayoutList size={14} />
                          {user.blogCount || 0}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap text-center text-xs text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigate(`/run/Dashboard/user/${user._id}`)}
                            className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-all"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => setBlockModal({ isOpen: true, user })}
                              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                                user.isBlocked
                                  ? 'border-slate-200 bg-white text-green-600 hover:bg-green-50'
                                  : 'border-slate-200 bg-white text-red-600 hover:bg-red-50'
                              }`}
                              title={user.isBlocked ? 'Unblock' : 'Block'}
                            >
                              {user.isBlocked ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-xs text-slate-500">
                      No users found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={blockModal.isOpen}
        title={blockModal.user?.isBlocked ? "Unblock User" : "Block User"}
        message={`Are you sure you want to ${blockModal.user?.isBlocked ? "unblock" : "block"} ${blockModal.user?.name}?`}
        confirmText={blockModal.user?.isBlocked ? "Unblock" : "Block"}
        isDestructive={!blockModal.user?.isBlocked}
        onConfirm={handleToggleBlock}
        onCancel={() => setBlockModal({ isOpen: false, user: null })}
      />
    </div>
  );
};
