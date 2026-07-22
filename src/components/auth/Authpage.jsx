import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import {
  loginUser, registerUser, verifyOTP, resendOTP,
  clearError, clearSuccess, setToken, getMe, resetAuthFlow
} from '../../store/slices/authSlice.jsx';
import Swal from 'sweetalert2';
import { ForgotPasswordModal } from './ForgotPasswordModal.jsx';

export const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    isLoading, error, token, user, otpSent, otpEmail,
    needsVerification, successMessage
  } = useSelector((state) => state.auth);



  // Redirect when authenticated
  useEffect(() => {
    if (token && user) {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Logged in successfully!',
        confirmButtonColor: '#FACC15',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        if (!user.isProfileComplete) {
          navigate('/profile-setup');
        } else {
          navigate('/profile');
        }
      });
    }
  }, [token, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());
    if (isSignUp) {
      dispatch(registerUser(formData));
    } else {
      dispatch(loginUser({ email: formData.email, password: formData.password }));
    }
  };

  // OTP input handling
  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[value.length - 1];
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    // Auto-focus next
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newDigits = [...otpDigits];
    pasted.split('').forEach((char, i) => { newDigits[i] = char; });
    setOtpDigits(newDigits);
    if (pasted.length >= 6) otpRefs.current[5]?.focus();
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    const otp = otpDigits.join('');
    if (otp.length !== 6) return;
    dispatch(verifyOTP({ email: otpEmail, otp }));
  };

  const handleResendOTP = () => {
    dispatch(resendOTP(otpEmail));
    setOtpDigits(['', '', '', '', '', '']);
  };



  // Show OTP verification step
  if (otpSent || needsVerification) {
    return (
      <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-50 px-4 py-12 text-gray-900 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-yellow-400/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-yellow-400/5 blur-[140px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
          {/* Animated Lock Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-yellow-200 bg-yellow-50">
            <Mail className="h-9 w-9 text-yellow-500 animate-pulse" />
          </div>

          <h2 className="text-center text-2xl font-extrabold tracking-wider text-gray-900 mb-2">
            VERIFY YOUR EMAIL
          </h2>
          <p className="text-center text-sm text-gray-500 mb-2">
            We sent a 6-digit code to
          </p>
          <p className="text-center text-sm font-semibold text-gray-900 mb-8">
            {otpEmail}
          </p>

          {error && (
            <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-3 text-center text-xs text-red-600">
              {typeof error === 'object' ? error.message : error}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 rounded-md bg-green-50 border border-green-200 p-3 text-center text-xs text-green-600">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleVerifyOTP}>
            {/* OTP Inputs */}
            <div className="flex justify-center gap-3 mb-8">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={el => otpRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={index === 0 ? handleOtpPaste : undefined}
                  className="h-14 w-12 rounded-lg border border-gray-300 bg-gray-50 text-center text-xl font-bold text-gray-900 transition-all duration-300 focus:border-yellow-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || otpDigits.join('').length !== 6}
              className="w-full rounded-lg bg-yellow-400 py-3.5 text-sm font-bold text-black transition-all duration-300 hover:bg-yellow-500 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>VERIFY CODE <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleResendOTP}
              disabled={isLoading}
              className="text-xs text-gray-500 hover:text-yellow-600 transition-colors flex items-center justify-center gap-1.5 mx-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Didn't receive the code? Resend
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => {
                dispatch(resetAuthFlow());
                setOtpDigits(['', '', '', '', '', '']);
              }}
              className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              ← Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Sign In / Sign Up form
  return (
    <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-50 px-4 py-12 text-gray-900 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-yellow-400/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-yellow-400/5 blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="mb-2 flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-semibold">InkSphere</span>
        </div>
        <h2 className="text-center text-3xl font-extrabold tracking-wider text-gray-900 mb-2">
          {isSignUp ? 'CREATE ACCOUNT' : 'WELCOME BACK'}
        </h2>
        <p className="text-center text-xs text-gray-500 mb-8 uppercase tracking-widest">
          {isSignUp ? 'Join the InkSphere community' : 'Sign in to publish your blog'}
        </p>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-3 text-center text-xs text-red-600">
            {typeof error === 'object' ? error.message : error}
          </div>
        )}



        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-gray-300 bg-white pl-11 pr-4 py-3 text-sm text-gray-900 transition-all duration-300 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 placeholder:text-gray-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 bg-white pl-11 pr-4 py-3 text-sm text-gray-900 transition-all duration-300 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 bg-white pl-11 pr-11 py-3 text-sm text-gray-900 transition-all duration-300 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {!isSignUp && (
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs font-semibold text-yellow-600 hover:text-yellow-700 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full rounded-lg bg-yellow-400 py-3.5 text-sm font-bold text-black transition-all duration-300 hover:bg-yellow-500 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>{isSignUp ? 'SIGN UP & CONTINUE' : 'SIGN IN'} <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center text-xs text-gray-500">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              dispatch(clearError());
            }}
            className="font-bold text-yellow-600 hover:text-yellow-700 hover:underline ml-1 transition-colors"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>

      <ForgotPasswordModal 
        isOpen={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
      />
    </div>
  );
};