import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserDetails, adminDeleteBlog, toggleUserBlock, clearSelectedUser } from '../../Store/Slices/adminSlice.jsx';
import {
  ArrowLeft, Mail, MapPin, Globe, Heart, MessageSquare,
  FileText, Calendar, Trash2, CheckCircle, XCircle,
  ShieldAlert, ShieldCheck, BookOpen, Eye, User as UserIcon
} from 'lucide-react';
import ConfirmModal from '../../Components/ConfirmModal.jsx';

export const UserDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedUser, selectedUserBlogs, selectedUserStats, isLoadingUserDetails, isDeletingBlog } = useSelector(state => state.admin);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, blog: null });
  const [blockModal, setBlockModal] = useState({ isOpen: false });

  useEffect(() => {
    dispatch(fetchUserDetails(id));
    return () => {
      dispatch(clearSelectedUser());
    };
  }, [dispatch, id]);

  const handleDeleteBlog = () => {
    if (deleteModal.blog) {
      dispatch(adminDeleteBlog(deleteModal.blog._id));
    }
    setDeleteModal({ isOpen: false, blog: null });
  };

  const handleToggleBlock = () => {
    dispatch(toggleUserBlock(id));
    setBlockModal({ isOpen: false });
  };

  if (isLoadingUserDetails || !selectedUser) {
    return (
      <div className="udp-loading">
        <div className="udp-loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="udp-container">
      {/* Back Button */}
      <button onClick={() => navigate('/run/Dashboard/home')} className="udp-back-btn">
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      {/* User Profile Card */}
      <div className="udp-profile-card">
        <div className="udp-profile-top">
          <div className="udp-avatar-wrap">
            <img
              src={selectedUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name)}&background=FACC15&color=000&bold=true&size=120`}
              alt={selectedUser.name}
              className="udp-avatar"
            />
            {selectedUser.isVerified && (
              <div className="udp-verified-badge">
                <CheckCircle size={14} />
              </div>
            )}
          </div>

          <div className="udp-profile-info">
            <div className="udp-name-row">
              <h2 className="udp-name">{selectedUser.name}</h2>
              <div className="udp-role-badges">
                <span className={`udp-badge ${selectedUser.role === 'admin' ? 'udp-badge-yellow' : 'udp-badge-dim'}`}>
                  {selectedUser.role}
                </span>
                {selectedUser.isBlocked && (
                  <span className="udp-badge udp-badge-red">Blocked</span>
                )}
              </div>
            </div>
            {selectedUser.username && (
              <p className="udp-username">@{selectedUser.username}</p>
            )}
            {selectedUser.bio && (
              <p className="udp-bio">{selectedUser.bio}</p>
            )}

            <div className="udp-meta-list">
              <div className="udp-meta-item">
                <Mail size={14} />
                <span>{selectedUser.email}</span>
              </div>
              {selectedUser.location && (
                <div className="udp-meta-item">
                  <MapPin size={14} />
                  <span>{selectedUser.location}</span>
                </div>
              )}
              {selectedUser.website && (
                <div className="udp-meta-item">
                  <Globe size={14} />
                  <span>{selectedUser.website}</span>
                </div>
              )}
              {selectedUser.hobby && (
                <div className="udp-meta-item">
                  <UserIcon size={14} />
                  <span>Hobby: {selectedUser.hobby}</span>
                </div>
              )}
              <div className="udp-meta-item">
                <Calendar size={14} />
                <span>Joined {new Date(selectedUser.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {selectedUser.role !== 'admin' && (
          <div className="udp-profile-actions">
            <button
              onClick={() => setBlockModal({ isOpen: true })}
              className={`udp-profile-action-btn ${selectedUser.isBlocked ? 'udp-unblock-btn' : 'udp-block-btn'}`}
            >
              {selectedUser.isBlocked ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
              {selectedUser.isBlocked ? 'Unblock User' : 'Block User'}
            </button>
          </div>
        )}
      </div>

      {/* Stats Row */}
      {selectedUserStats && (
        <div className="udp-stats-row">
          <div className="udp-stat-item">
            <FileText size={18} className="udp-stat-icon-blue" />
            <div>
              <span className="udp-stat-val">{selectedUserStats.totalBlogs}</span>
              <span className="udp-stat-lbl">Total Blogs</span>
            </div>
          </div>
          <div className="udp-stat-item">
            <BookOpen size={18} className="udp-stat-icon-green" />
            <div>
              <span className="udp-stat-val">{selectedUserStats.publishedBlogs}</span>
              <span className="udp-stat-lbl">Published</span>
            </div>
          </div>
          <div className="udp-stat-item">
            <Heart size={18} className="udp-stat-icon-red" />
            <div>
              <span className="udp-stat-val">{selectedUserStats.totalLikes}</span>
              <span className="udp-stat-lbl">Likes</span>
            </div>
          </div>
          <div className="udp-stat-item">
            <MessageSquare size={18} className="udp-stat-icon-purple" />
            <div>
              <span className="udp-stat-val">{selectedUserStats.totalComments}</span>
              <span className="udp-stat-lbl">Comments</span>
            </div>
          </div>
        </div>
      )}

      {/* Blogs Section */}
      <div className="udp-blogs-section">
        <h3 className="udp-blogs-title">
          <FileText size={18} />
          All Blogs
          <span className="udp-blogs-count">{selectedUserBlogs.length}</span>
        </h3>

        {selectedUserBlogs.length === 0 ? (
          <div className="udp-empty-blogs">
            <FileText size={40} />
            <p>This user hasn't published any blogs yet.</p>
          </div>
        ) : (
          <div className="udp-blogs-grid">
            {selectedUserBlogs.map((blog) => (
              <div key={blog._id} className="udp-blog-card">
                {blog.coverImage && (
                  <div className="udp-blog-cover">
                    <img src={blog.coverImage} alt={blog.title} />
                    <div className={`udp-blog-status ${blog.isPublished ? 'udp-status-pub' : 'udp-status-draft'}`}>
                      {blog.isPublished ? 'Published' : 'Draft'}
                    </div>
                  </div>
                )}
                <div className="udp-blog-body">
                  <h4 className="udp-blog-title">{blog.title}</h4>
                  {blog.description && (
                    <p className="udp-blog-desc">{blog.description}</p>
                  )}

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="udp-blog-tags">
                      {blog.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="udp-blog-tag">#{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="udp-blog-footer">
                    <div className="udp-blog-stats">
                      <span className="udp-blog-stat">
                        <Heart size={13} /> {blog.likesCount || 0}
                      </span>
                      <span className="udp-blog-stat">
                        <MessageSquare size={13} /> {blog.commentsCount || 0}
                      </span>
                      <span className="udp-blog-stat">
                        <Calendar size={13} />
                        {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, blog })}
                      className="udp-blog-delete"
                      title="Delete Blog"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Blog Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Blog"
        message={`Are you sure you want to permanently delete "${deleteModal.blog?.title}"? This action cannot be undone. All comments and likes will also be removed.`}
        confirmText="Delete Blog"
        isDestructive={true}
        onConfirm={handleDeleteBlog}
        onCancel={() => setDeleteModal({ isOpen: false, blog: null })}
      />

      {/* Block User Modal */}
      <ConfirmModal
        isOpen={blockModal.isOpen}
        title={selectedUser?.isBlocked ? "Unblock User" : "Block User"}
        message={`Are you sure you want to ${selectedUser?.isBlocked ? "unblock" : "block"} ${selectedUser?.name}? ${!selectedUser?.isBlocked ? "They will no longer be able to log in or publish blogs." : ""}`}
        confirmText={selectedUser?.isBlocked ? "Unblock" : "Block"}
        isDestructive={!selectedUser?.isBlocked}
        onConfirm={handleToggleBlock}
        onCancel={() => setBlockModal({ isOpen: false })}
      />

      <style>{`
        .udp-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .udp-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 400px;
        }

        .udp-loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255,255,255,0.06);
          border-top-color: #FACC15;
          border-radius: 50%;
          animation: udpSpin 0.6s linear infinite;
        }

        @keyframes udpSpin {
          to { transform: rotate(360deg); }
        }

        /* ===== BACK BTN ===== */
        .udp-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: #6b6b80;
          font-size: 13px;
          font-family: inherit;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
          transition: color 0.2s;
        }

        .udp-back-btn:hover {
          color: #FACC15;
        }

        /* ===== PROFILE CARD ===== */
        .udp-profile-card {
          background: #0f0f18;
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 16px;
          padding: 28px;
        }

        .udp-profile-top {
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }

        @media (max-width: 640px) {
          .udp-profile-top {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
        }

        .udp-avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }

        .udp-avatar {
          width: 90px;
          height: 90px;
          border-radius: 18px;
          object-fit: cover;
          border: 2px solid rgba(255,255,255,0.06);
        }

        .udp-verified-badge {
          position: absolute;
          bottom: -4px;
          right: -4px;
          width: 26px;
          height: 26px;
          background: #22c55e;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          border: 3px solid #0f0f18;
        }

        .udp-profile-info {
          flex: 1;
          min-width: 0;
        }

        .udp-name-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        @media (max-width: 640px) {
          .udp-name-row {
            justify-content: center;
          }
        }

        .udp-name {
          font-size: 22px;
          font-weight: 800;
          color: #fafafa;
          margin: 0;
        }

        .udp-role-badges {
          display: flex;
          gap: 6px;
        }

        .udp-badge {
          display: inline-flex;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .udp-badge-yellow {
          background: rgba(250,204,21,0.1);
          color: #FACC15;
        }

        .udp-badge-dim {
          background: rgba(255,255,255,0.04);
          color: #5a5a6e;
        }

        .udp-badge-red {
          background: rgba(239,68,68,0.1);
          color: #f87171;
        }

        .udp-username {
          color: #FACC15;
          font-size: 14px;
          margin: 4px 0 0;
          font-weight: 500;
        }

        .udp-bio {
          color: #8b8b9e;
          font-size: 13px;
          margin: 8px 0 0;
          line-height: 1.5;
        }

        .udp-meta-list {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 14px;
        }

        @media (max-width: 640px) {
          .udp-meta-list {
            justify-content: center;
          }
        }

        .udp-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #5a5a6e;
          font-size: 12px;
        }

        .udp-profile-actions {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.04);
        }

        .udp-profile-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 10px;
          border: none;
          font-size: 13px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s;
        }

        .udp-block-btn {
          background: rgba(239,68,68,0.1);
          color: #f87171;
        }

        .udp-block-btn:hover {
          background: rgba(239,68,68,0.15);
        }

        .udp-unblock-btn {
          background: rgba(34,197,94,0.1);
          color: #4ade80;
        }

        .udp-unblock-btn:hover {
          background: rgba(34,197,94,0.15);
        }

        /* ===== STATS ROW ===== */
        .udp-stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
          gap: 14px;
        }

        .udp-stat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 18px;
          background: #0f0f18;
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 14px;
        }

        .udp-stat-item div {
          display: flex;
          flex-direction: column;
        }

        .udp-stat-val {
          font-size: 20px;
          font-weight: 800;
          color: #fafafa;
          line-height: 1;
        }

        .udp-stat-lbl {
          font-size: 11px;
          color: #5a5a6e;
          margin-top: 4px;
        }

        .udp-stat-icon-blue { color: #60a5fa; }
        .udp-stat-icon-green { color: #4ade80; }
        .udp-stat-icon-red { color: #f87171; }
        .udp-stat-icon-purple { color: #c084fc; }

        /* ===== BLOGS SECTION ===== */
        .udp-blogs-section {
          background: #0f0f18;
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 16px;
          padding: 24px;
        }

        .udp-blogs-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 700;
          color: #fafafa;
          margin: 0 0 20px;
        }

        .udp-blogs-count {
          background: rgba(250,204,21,0.1);
          color: #FACC15;
          padding: 2px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .udp-empty-blogs {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 60px 20px;
          color: #3a3a4e;
          text-align: center;
        }

        .udp-empty-blogs p {
          font-size: 14px;
          margin: 0;
        }

        .udp-blogs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        @media (max-width: 640px) {
          .udp-blogs-grid {
            grid-template-columns: 1fr;
          }
        }

        .udp-blog-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.25s ease;
        }

        .udp-blog-card:hover {
          border-color: rgba(255,255,255,0.08);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }

        .udp-blog-cover {
          position: relative;
          height: 160px;
          overflow: hidden;
        }

        .udp-blog-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .udp-blog-status {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .udp-status-pub {
          background: rgba(34,197,94,0.2);
          color: #4ade80;
        }

        .udp-status-draft {
          background: rgba(250,204,21,0.2);
          color: #FACC15;
        }

        .udp-blog-body {
          padding: 16px;
        }

        .udp-blog-title {
          font-size: 15px;
          font-weight: 700;
          color: #e0e0ec;
          margin: 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .udp-blog-desc {
          font-size: 12px;
          color: #5a5a6e;
          margin: 8px 0 0;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .udp-blog-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: 10px;
        }

        .udp-blog-tag {
          font-size: 11px;
          color: #FACC15;
          background: rgba(250,204,21,0.06);
          padding: 2px 8px;
          border-radius: 6px;
        }

        .udp-blog-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.04);
        }

        .udp-blog-stats {
          display: flex;
          gap: 12px;
        }

        .udp-blog-stat {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #5a5a6e;
        }

        .udp-blog-delete {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid rgba(239,68,68,0.15);
          background: rgba(239,68,68,0.06);
          color: #f87171;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .udp-blog-delete:hover {
          background: rgba(239,68,68,0.15);
          border-color: rgba(239,68,68,0.3);
        }
      `}</style>
    </div>
  );
};

export default UserDetailPage;
