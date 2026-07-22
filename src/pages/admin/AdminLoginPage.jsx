import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminLogin, clearAdminError } from '../../store/slices/adminSlice.jsx';
import { Shield, Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { adminToken, isLoggingIn, error } = useSelector(state => state.admin);

  useEffect(() => {
    if (adminToken) {
      navigate('/run/Dashboard/home', { replace: true });
    }
  }, [adminToken, navigate]);

  useEffect(() => {
    dispatch(clearAdminError());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(adminLogin({ email, password }));
  };

  return (
    <div className="admin-login-container">
      {/* Animated background */}
      <div className="admin-login-bg">
        <div className="admin-login-orb admin-login-orb-1"></div>
        <div className="admin-login-orb admin-login-orb-2"></div>
        <div className="admin-login-orb admin-login-orb-3"></div>
      </div>

      <div className="admin-login-card">
        {/* Logo */}
        <div className="admin-login-logo">
          <div className="admin-login-shield">
            <Shield size={28} />
          </div>
          <h1 className="admin-login-title">
            INKSPHERE <span className="admin-login-accent">ADMIN</span>
          </h1>
          <p className="admin-login-subtitle">Secure access to the control panel</p>
        </div>

        {/* Error */}
        {error && (
          <div className="admin-login-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-field">
            <label className="admin-login-label">Email Address</label>
            <div className="admin-login-input-wrap">
              <Mail size={18} className="admin-login-input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@inksphere.com"
                className="admin-login-input"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="admin-login-field">
            <label className="admin-login-label">Password</label>
            <div className="admin-login-input-wrap">
              <Lock size={18} className="admin-login-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="admin-login-input"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="admin-login-eye-btn"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="admin-login-submit"
          >
            {isLoggingIn ? (
              <div className="admin-login-spinner"></div>
            ) : (
              <>
                <Lock size={18} />
                Access Dashboard
              </>
            )}
          </button>
        </form>

        <p className="admin-login-footer">
          Protected area • Unauthorized access prohibited
        </p>
      </div>

      <style>{`
        .admin-login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #06060b;
          position: relative;
          overflow: hidden;
          padding: 20px;
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
        }

        .admin-login-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .admin-login-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.15;
        }

        .admin-login-orb-1 {
          width: 500px;
          height: 500px;
          background: #FACC15;
          top: -100px;
          right: -100px;
          animation: adminOrb1 12s ease-in-out infinite;
        }

        .admin-login-orb-2 {
          width: 400px;
          height: 400px;
          background: #a855f7;
          bottom: -80px;
          left: -80px;
          animation: adminOrb2 15s ease-in-out infinite;
        }

        .admin-login-orb-3 {
          width: 300px;
          height: 300px;
          background: #3b82f6;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: adminOrb3 10s ease-in-out infinite;
        }

        @keyframes adminOrb1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-40px, 40px); }
        }

        @keyframes adminOrb2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(40px, -40px); }
        }

        @keyframes adminOrb3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
        }

        .admin-login-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          background: rgba(18, 18, 26, 0.8);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 20px;
          padding: 40px 36px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
          animation: adminCardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes adminCardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .admin-login-logo {
          text-align: center;
          margin-bottom: 32px;
        }

        .admin-login-shield {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #FACC15 0%, #EAB308 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: #06060b;
          box-shadow: 0 8px 24px rgba(250, 204, 21, 0.25);
        }

        .admin-login-title {
          font-size: 22px;
          font-weight: 900;
          color: #fafafa;
          letter-spacing: 3px;
          margin: 0;
        }

        .admin-login-accent {
          color: #FACC15;
        }

        .admin-login-subtitle {
          color: #6b6b80;
          font-size: 13px;
          margin-top: 6px;
        }

        .admin-login-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 14px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 10px;
          color: #f87171;
          font-size: 13px;
          margin-bottom: 20px;
          animation: adminShake 0.4s ease;
        }

        @keyframes adminShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .admin-login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .admin-login-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .admin-login-label {
          font-size: 12px;
          font-weight: 600;
          color: #8b8b9e;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .admin-login-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .admin-login-input-icon {
          position: absolute;
          left: 14px;
          color: #4a4a5e;
          pointer-events: none;
        }

        .admin-login-input {
          width: 100%;
          padding: 14px 14px 14px 44px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          color: #fafafa;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: all 0.3s ease;
        }

        .admin-login-input:focus {
          border-color: rgba(250, 204, 21, 0.4);
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.08);
        }

        .admin-login-input::placeholder {
          color: #3a3a4e;
        }

        .admin-login-eye-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #4a4a5e;
          cursor: pointer;
          padding: 4px;
          transition: color 0.2s;
        }

        .admin-login-eye-btn:hover {
          color: #8b8b9e;
        }

        .admin-login-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #FACC15 0%, #EAB308 100%);
          border: none;
          border-radius: 12px;
          color: #06060b;
          font-size: 15px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(250, 204, 21, 0.2);
          margin-top: 4px;
        }

        .admin-login-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(250, 204, 21, 0.3);
        }

        .admin-login-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .admin-login-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .admin-login-spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(6, 6, 11, 0.2);
          border-top-color: #06060b;
          border-radius: 50%;
          animation: adminSpin 0.6s linear infinite;
        }

        @keyframes adminSpin {
          to { transform: rotate(360deg); }
        }

        .admin-login-footer {
          text-align: center;
          color: #3a3a4e;
          font-size: 11px;
          margin-top: 24px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
      `}</style>
    </div>
  );
};

export default AdminLoginPage;
