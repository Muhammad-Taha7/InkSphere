import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import {
  loginUser, registerUser, verifyOTP, resendOTP,
  clearError, clearSuccess, setToken, getMe, resetAuthFlow
} from '../../Store/Slices/authSlice.jsx';

export const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    isLoading, error, token, user, otpSent, otpEmail,
    needsVerification, successMessage
  } = useSelector((state) => state.auth);

  // Handle Google OAuth callback
  useEffect(() => {
    const urlToken = searchParams.get('token');
    const isProfileComplete = searchParams.get('isProfileComplete');

    if (urlToken) {
      dispatch(setToken(urlToken));
      dispatch(getMe());
      if (isProfileComplete === 'false') {
        navigate('/profile-setup');
      } else {
        navigate('/profile');
      }
    }
  }, [searchParams, dispatch, navigate]);

  // Redirect when authenticated
  useEffect(() => {
    if (token && user) {
      if (!user.isProfileComplete) {
        navigate('/profile-setup');
      } else {
        navigate('/profile');
      }
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

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
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

        {/* Google Sign In */}
        <button
          onClick={handleGoogleLogin}
          className="mb-6 w-full rounded-lg border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50 flex items-center justify-center gap-3 shadow-sm"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-4 text-gray-500 uppercase tracking-wider">or continue with email</span>
          </div>
        </div>

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
    </div>
  );
};