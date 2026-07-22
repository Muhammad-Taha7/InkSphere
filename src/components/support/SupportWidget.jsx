import React, { useState, useEffect } from 'react';
import { MessageCircleQuestion, X, Send, ChevronDown } from 'lucide-react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import axios from 'axios';

export const SupportWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState('Account Issue');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { token, user } = useSelector(state => state.auth);

  const categories = ['Account Issue', 'Blog Issue', 'Technical Bug', 'Other'];

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.category-dropdown')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Only render if user is logged in
  if (!token || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        'https://ink-sphere-backend-ukrx.vercel.app/api/queries',
        { category, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      Swal.fire({
        icon: 'success',
        title: 'Query Submitted!',
        text: 'Our 24/7 support team will review it and reply via email.',
        confirmButtonColor: '#FACC15',
      });

      setIsOpen(false);
      setDescription('');
      setCategory('Account Issue');
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.message || 'Failed to submit query.',
        confirmButtonColor: '#FACC15',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center justify-center h-14 w-14 rounded-full shadow-2xl transition-all duration-300 transform ${
          isOpen ? 'bg-gray-900 rotate-90 scale-100' : 'bg-yellow-400 hover:bg-yellow-500 hover:scale-105'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white transform -rotate-90" />
        ) : (
          <MessageCircleQuestion className="h-6 w-6 text-black" />
        )}
      </button>

      {/* Popover Form */}
      <div
        className={`absolute bottom-20 right-0 w-80 sm:w-96 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-2xl transition-all duration-300 origin-bottom-right ${
          isOpen
            ? 'scale-100 opacity-100 translate-y-0 pointer-events-auto'
            : 'scale-95 opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="p-5 border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50 rounded-t-2xl">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            24/7 Support
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Facing an issue? Tell us how we can help.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="relative category-dropdown">
            <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              What is the issue?
            </label>
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-full px-4 py-2.5 text-sm bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg cursor-pointer hover:border-yellow-400 transition-colors"
            >
              <span className="text-gray-900 dark:text-zinc-100">{category}</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-lg shadow-xl z-10 py-1">
                {categories.map((c) => (
                  <div
                    key={c}
                    onClick={() => {
                      setCategory(c);
                      setIsDropdownOpen(false);
                    }}
                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 hover:text-yellow-600 cursor-pointer transition-colors"
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              required
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe the issue in detail..."
              className="w-full px-4 py-3 text-sm bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all resize-none text-gray-900 dark:text-zinc-100 placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !description.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4" /> Send Query
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
