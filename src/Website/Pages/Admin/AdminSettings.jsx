import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAdminCredentials, clearAdminError } from '../../Store/Slices/adminSlice.jsx';
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
    <div className="sett-container">
      <div className="sett-header">
        <h1 className="sett-title">Admin Settings</h1>
        <p className="sett-subtitle">Manage your administrator username and password</p>
      </div>

      <div className="sett-card">
        <div className="sett-card-header">
          <Shield className="sett-icon-yellow" />
          <h2 className="sett-card-title">Security Credentials</h2>
        </div>

        {/* Message banners */}
        {localError && (
          <div className="sett-banner sett-banner-error">
            <AlertCircle size={16} />
            <span>{localError}</span>
          </div>
        )}

        {error && (
          <div className="sett-banner sett-banner-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {localSuccess && (
          <div className="sett-banner sett-banner-success">
            <CheckCircle2 size={16} />
            <span>Credentials updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="sett-form">
          <div className="sett-field">
            <label className="sett-label">Admin Email (Read-Only)</label>
            <div className="sett-input-wrap read-only">
              <User size={16} className="sett-input-icon" />
              <input
                type="email"
                value={adminUser?.email || 'admin@inksphere.com'}
                disabled
                className="sett-input"
              />
            </div>
            <p className="sett-hint">Admin email address cannot be changed.</p>
          </div>

          <div className="sett-field">
            <label className="sett-label">Admin Username</label>
            <div className="sett-input-wrap">
              <User size={16} className="sett-input-icon" />
              <input
                type="text"
                placeholder="Admin"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="sett-input"
                required
              />
            </div>
            <p className="sett-hint">Username must be 3-30 characters, alphanumeric & underscores only.</p>
          </div>

          <div className="sett-divider"></div>

          <div className="sett-grid">
            <div className="sett-field">
              <label className="sett-label">New Password</label>
              <div className="sett-input-wrap">
                <Lock size={16} className="sett-input-icon" />
                <input
                  type="password"
                  placeholder="Leave blank to keep same"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="sett-input"
                />
              </div>
            </div>

            <div className="sett-field">
              <label className="sett-label">Confirm New Password</label>
              <div className="sett-input-wrap">
                <Lock size={16} className="sett-input-icon" />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="sett-input"
                />
              </div>
            </div>
          </div>

          <div className="sett-divider"></div>

          <div className="sett-field">
            <label className="sett-label sett-label-critical">Current Password (Required)</label>
            <div className="sett-input-wrap critical">
              <Lock size={16} className="sett-input-icon" />
              <input
                type="password"
                placeholder="Enter current password to save changes"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="sett-input"
                required
              />
            </div>
            <p className="sett-hint">To update any credentials, you must confirm your current admin password.</p>
          </div>

          <button
            type="submit"
            disabled={isUpdatingCredentials}
            className="sett-submit-btn"
          >
            {isUpdatingCredentials ? (
              <div className="sett-spinner"></div>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </div>

      <style>{`
        .sett-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .sett-header {
          display: flex;
          flex-direction: column;
        }

        .sett-title {
          font-size: 28px;
          font-weight: 800;
          color: #fafafa;
          margin: 0;
        }

        .sett-subtitle {
          color: #5a5a6e;
          font-size: 14px;
          margin-top: 4px;
        }

        /* ===== CARD ===== */
        .sett-card {
          background: #0f0f18;
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 16px;
          padding: 32px;
          max-width: 680px;
        }

        .sett-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .sett-icon-yellow {
          color: #FACC15;
        }

        .sett-card-title {
          font-size: 18px;
          font-weight: 700;
          color: #fafafa;
          margin: 0;
        }

        /* ===== BANNER ===== */
        .sett-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          margin-bottom: 24px;
          animation: settFadeIn 0.3s ease;
        }

        @keyframes settFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .sett-banner-error {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.15);
          color: #f87171;
        }

        .sett-banner-success {
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.15);
          color: #4ade80;
        }

        /* ===== FORM ===== */
        .sett-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .sett-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        @media (max-width: 600px) {
          .sett-grid {
            grid-template-columns: 1fr;
          }
        }

        .sett-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sett-label {
          font-size: 12px;
          font-weight: 600;
          color: #8b8b9e;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .sett-label-critical {
          color: #f87171;
        }

        .sett-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .sett-input-icon {
          position: absolute;
          left: 12px;
          color: #4a4a5e;
          pointer-events: none;
        }

        .sett-input {
          width: 100%;
          padding: 11px 12px 11px 38px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          color: #fafafa;
          font-size: 13px;
          font-family: inherit;
          outline: none;
          transition: all 0.2s ease;
        }

        .sett-input:focus {
          border-color: rgba(250, 204, 21, 0.3);
          background: rgba(255, 255, 255, 0.05);
        }

        .sett-input-wrap.read-only .sett-input {
          background: rgba(255, 255, 255, 0.015);
          border-color: rgba(255, 255, 255, 0.03);
          color: #5a5a6e;
          cursor: not-allowed;
        }

        .sett-input-wrap.critical .sett-input {
          border-color: rgba(239, 68, 68, 0.25);
        }

        .sett-input-wrap.critical .sett-input:focus {
          border-color: rgba(239, 68, 68, 0.4);
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.05);
        }

        .sett-hint {
          font-size: 11px;
          color: #4a4a5e;
          margin: 0;
        }

        .sett-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.04);
          margin: 8px 0;
        }

        .sett-submit-btn {
          align-self: flex-start;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 11px 24px;
          background: linear-gradient(135deg, #FACC15, #EAB308);
          border: none;
          border-radius: 10px;
          color: #06060b;
          font-size: 13px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 12px rgba(250, 204, 21, 0.15);
        }

        .sett-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(250, 204, 21, 0.25);
        }

        .sett-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .sett-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(6, 6, 11, 0.2);
          border-top-color: #06060b;
          border-radius: 50%;
          animation: settSpin 0.6s linear infinite;
        }

        @keyframes settSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminSettings;
