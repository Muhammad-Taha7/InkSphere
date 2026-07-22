import React, { useState } from 'react';
import { X, Mail, KeyRound, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';

export const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      Swal.fire({
        icon: 'success',
        title: 'Password Reset',
        text: 'Your password has been reset successfully!',
        confirmButtonColor: '#FACC15',
      });
      
      onClose();
      // Reset state for next time
      setTimeout(() => {
        setStep(1);
        setEmail('');
        setOtp('');
        setNewPassword('');
      }, 500);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {step === 1 ? 'Reset Password' : 'Enter OTP & New Password'}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {step === 1 
            ? "Enter your email address and we'll send you a code to reset your password."
            : `We sent a code to ${email}.`}
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 bg-white pl-11 pr-4 py-3 text-sm text-gray-900 transition-all focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-yellow-400 py-3 text-sm font-bold text-black transition-all hover:bg-yellow-500 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>Send Reset Code <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                6-Digit OTP
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full rounded-lg border border-gray-300 bg-white pl-11 pr-4 py-3 text-sm text-gray-900 transition-all focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 tracking-widest font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 bg-white pl-11 pr-4 py-3 text-sm text-gray-900 transition-all focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6 || newPassword.length < 6}
              className="w-full rounded-lg bg-yellow-400 py-3 text-sm font-bold text-black transition-all hover:bg-yellow-500 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>Reset Password <CheckCircle2 className="h-4 w-4" /></>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
