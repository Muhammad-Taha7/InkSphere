import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Globe, Camera, ArrowRight, BookOpen, Briefcase, Building2, Code2, Link } from 'lucide-react';
import { completeProfile, updateProfile, clearError, clearSuccess } from '../Store/Slices/authSlice.jsx';

export const ProfileSetup = ({ isEditMode = false }) => {
  const { isLoading, error, successMessage, user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    hobby: '',
    location: '',
    website: '',
    jobTitle: '',
    company: '',
    githubUrl: '',
    linkedinUrl: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Populate data if in edit mode and user is available
  useEffect(() => {
    if (isEditMode && user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        hobby: user.hobby || '',
        location: user.location || '',
        website: user.website || '',
        jobTitle: user.jobTitle || '',
        company: user.company || '',
        githubUrl: user.githubUrl || '',
        linkedinUrl: user.linkedinUrl || ''
      });
    }
  }, [isEditMode, user]);

  useEffect(() => {
    // If profile is already complete and we are NOT in edit mode, redirect to profile page
    if (user?.isProfileComplete && !isEditMode) {
      navigate('/profile');
    }
  }, [user, navigate, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        import('react-hot-toast').then(mod => mod.default.error('File size should be less than 5MB'));
        return;
      }
      setAvatar(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('username', formData.username);
    data.append('bio', formData.bio);
    data.append('hobby', formData.hobby);
    data.append('location', formData.location);
    data.append('website', formData.website);
    data.append('jobTitle', formData.jobTitle);
    data.append('company', formData.company);
    data.append('githubUrl', formData.githubUrl);
    data.append('linkedinUrl', formData.linkedinUrl);
    if (avatar) {
      data.append('avatar', avatar);
    }

    const action = isEditMode ? updateProfile : completeProfile;
    
    dispatch(action(data)).unwrap().then(() => {
        if (isEditMode) {
          import('react-hot-toast').then(mod => mod.default.success('Profile updated successfully!'));
        }
        // Redux will handle user update, useEffect will redirect if it's setup mode
    }).catch(() => {});
  };

  if (isEditMode) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-10 shadow-sm transition-colors duration-300">
        {error && (
          <div className="mb-6 rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-3 text-center text-xs text-red-600 dark:text-red-400">
            {typeof error === 'object' ? error.message : error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-md bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 p-3 text-center text-xs text-green-600 dark:text-green-400">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-6 border-b border-gray-100 dark:border-zinc-800">
            <div 
              className="relative h-24 w-24 rounded-full border-2 border-dashed border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 cursor-pointer overflow-hidden group transition-all duration-300 hover:border-yellow-400"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl || user?.avatar ? (
                <img 
                  src={previewUrl || user?.avatar} 
                  alt="Avatar preview" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400 dark:text-zinc-500 group-hover:text-yellow-500 transition-colors">
                  <Camera className="h-7 w-7" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Change</span>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">Profile Photo</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG, or GIF up to 5MB.</p>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-xs font-bold text-yellow-600 dark:text-yellow-500 hover:underline"
              >
                Upload new image
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-350 uppercase tracking-wider mb-1.5">
                Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-zinc-100 transition-all duration-300 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                />
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-350 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full rounded-lg border border-gray-200 dark:border-zinc-800/80 bg-gray-50 dark:bg-zinc-900/50 px-4 py-3 text-sm text-gray-500 dark:text-zinc-500 cursor-not-allowed opacity-70"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-350 uppercase tracking-wider mb-1.5">
                Username *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 font-medium">@</span>
                <input
                  type="text"
                  name="username"
                  required
                  disabled={isEditMode}
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className={`w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-zinc-100 transition-all duration-300 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 placeholder:text-gray-400 dark:placeholder:text-zinc-600 ${isEditMode ? 'opacity-60 cursor-not-allowed text-gray-500 dark:text-zinc-500 bg-gray-50 dark:bg-zinc-900/30' : ''}`}
                />
              </div>
            </div>

            {/* Hobby */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-350 uppercase tracking-wider mb-1.5">
                Main Interest / Hobby (Optional)
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
                <input
                  type="text"
                  name="hobby"
                  value={formData.hobby}
                  onChange={handleChange}
                  placeholder="e.g. Travel Photography"
                  className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-zinc-100 transition-all duration-300 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-350 uppercase tracking-wider mb-1.5">
                Location (Optional)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-zinc-100 transition-all duration-300 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-350 uppercase tracking-wider mb-1.5">
                Website (Optional)
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                  className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-zinc-100 transition-all duration-300 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                />
              </div>
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-350 uppercase tracking-wider mb-1.5">
                Job Title (Optional)
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer"
                  className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-zinc-100 transition-all duration-300 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-350 uppercase tracking-wider mb-1.5">
                Company (Optional)
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Tech Corp"
                  className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-zinc-100 transition-all duration-300 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                />
              </div>
            </div>

            {/* Github */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-350 uppercase tracking-wider mb-1.5">
                Github URL (Optional)
              </label>
              <div className="relative">
                <Code2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-zinc-100 transition-all duration-300 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                />
              </div>
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-350 uppercase tracking-wider mb-1.5">
                LinkedIn URL (Optional)
              </label>
              <div className="relative">
                <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-zinc-100 transition-all duration-300 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-zinc-350 uppercase tracking-wider mb-1.5">
              Bio (Optional)
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us a bit about yourself..."
              className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-sm text-gray-900 dark:text-zinc-100 transition-all duration-300 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 placeholder:text-gray-400 dark:placeholder:text-zinc-600 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !formData.username || !formData.name}
              className="rounded-lg bg-yellow-400 px-8 py-3.5 text-xs font-bold text-black uppercase tracking-wider transition-all duration-300 hover:bg-yellow-500 disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                'SAVE CHANGES'
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4 py-12 text-gray-900 dark:text-zinc-100 overflow-hidden transition-colors duration-300">
      {/* Background Decorative Elements */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-yellow-400/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-yellow-400/5 blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-gray-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 p-8 shadow-xl md:p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-wider text-gray-900 dark:text-white mb-2 uppercase">
            Complete Your Profile
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Let the InkSphere community know who you are
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-3 text-center text-xs text-red-650 dark:text-red-400">
            {typeof error === 'object' ? error.message : error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-md bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 p-3 text-center text-xs text-green-650 dark:text-green-400">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div 
              className="relative h-28 w-28 rounded-full border border-dashed border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 cursor-pointer overflow-hidden group transition-colors hover:border-yellow-400"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl || user?.avatar ? (
                <img 
                  src={previewUrl || user?.avatar} 
                  alt="Avatar preview" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400 dark:text-zinc-500 group-hover:text-yellow-500 transition-colors">
                  <Camera className="h-8 w-8" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-xs font-medium text-white">Upload</span>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Profile Photo (Optional)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-350 uppercase tracking-wider mb-1.5">
                Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-zinc-100 transition-all duration-300 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 placeholder:text-gray-400 dark:placeholder:text-zinc-650"
                />
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-350 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full rounded-lg border border-gray-200 dark:border-zinc-800/80 bg-gray-50 dark:bg-zinc-900/50 px-4 py-3 text-sm text-gray-500 dark:text-zinc-550 cursor-not-allowed opacity-70"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-350 uppercase tracking-wider mb-1.5">
                Username *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 font-medium">@</span>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-zinc-100 transition-all duration-300 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 placeholder:text-gray-400 dark:placeholder:text-zinc-650"
                />
              </div>
            </div>

            {/* Hobby */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-350 uppercase tracking-wider mb-1.5">
                Main Interest / Hobby (Optional)
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
                <input
                  type="text"
                  name="hobby"
                  value={formData.hobby}
                  onChange={handleChange}
                  placeholder="e.g. Travel Photography"
                  className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-zinc-100 transition-all duration-300 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 placeholder:text-gray-400 dark:placeholder:text-zinc-650"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-350 uppercase tracking-wider mb-1.5">
                Location (Optional)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-zinc-100 transition-all duration-300 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 placeholder:text-gray-400 dark:placeholder:text-zinc-650"
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-350 uppercase tracking-wider mb-1.5">
                Website (Optional)
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                  className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-zinc-100 transition-all duration-300 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 placeholder:text-gray-400 dark:placeholder:text-zinc-650"
                />
              </div>
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-350 uppercase tracking-wider mb-1.5">
                Job Title (Optional)
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer"
                  className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-zinc-100 transition-all duration-300 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 placeholder:text-gray-400 dark:placeholder:text-zinc-650"
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-350 uppercase tracking-wider mb-1.5">
                Company (Optional)
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Tech Corp"
                  className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-zinc-100 transition-all duration-300 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 placeholder:text-gray-400 dark:placeholder:text-zinc-650"
                />
              </div>
            </div>

            {/* Github */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-350 uppercase tracking-wider mb-1.5">
                Github URL (Optional)
              </label>
              <div className="relative">
                <Code2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-zinc-100 transition-all duration-300 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 placeholder:text-gray-400 dark:placeholder:text-zinc-650"
                />
              </div>
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-350 uppercase tracking-wider mb-1.5">
                LinkedIn URL (Optional)
              </label>
              <div className="relative">
                <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-zinc-100 transition-all duration-300 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 placeholder:text-gray-400 dark:placeholder:text-zinc-650"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-zinc-350 uppercase tracking-wider mb-1.5">
              Bio (Optional)
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us a bit about yourself..."
              className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-sm text-gray-900 dark:text-zinc-100 transition-all duration-300 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 placeholder:text-gray-400 dark:placeholder:text-zinc-650 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !formData.username || !formData.name}
            className="mt-6 w-full rounded-lg bg-yellow-400 py-4 text-sm font-bold text-black transition-all duration-300 hover:bg-yellow-500 disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>SAVE AND CONTINUE <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
