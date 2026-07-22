import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Camera, Save, Send, Trash2, Tag, FileText, Loader2, ImagePlus } from 'lucide-react';
import { createBlog } from '../Store/Slices/blogSlice.jsx';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.bubble.css';
import toast from 'react-hot-toast';

export const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    description: '',
    tags: '',
  });
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.blogs);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setCoverImage(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e, isPublished = true) => {
    e.preventDefault();
    
    // Simple content validation (strip HTML tags)
    const cleanContent = formData.content.replace(/<[^>]*>/g, '').trim();

    if (!formData.title.trim() || !cleanContent) {
      toast.error('Title and content are required');
      return;
    }

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('content', formData.content);
    submitData.append('description', formData.description);
    submitData.append('tags', formData.tags);
    submitData.append('isPublished', isPublished);
    if (coverImage) {
      submitData.append('coverImage', coverImage);
    }

    dispatch(createBlog(submitData))
      .unwrap()
      .then(() => {
        toast.success(isPublished ? 'Story published!' : 'Draft saved!');
        navigate('/profile/my-blogs');
      })
      .catch((err) => {
        toast.error(err?.message || 'Error creating blog');
      });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Page Title */}
      <div className="border-b border-gray-200 dark:border-zinc-800 pb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Write a New Story
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
          Draft your ideas, format rich text, and share your perspective.
        </p>
      </div>

      <form className="space-y-6">
        {/* Cover Image Upload Area */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300">
            Cover Image
          </label>
          <div
            className="group relative flex h-64 sm:h-80 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 transition-all hover:border-yellow-500 dark:hover:border-yellow-500/80"
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <>
                <img
                  src={previewUrl}
                  alt="Cover preview"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <span className="flex items-center gap-2 rounded-xl bg-white/90 dark:bg-zinc-900/90 px-4 py-2 text-xs font-semibold text-gray-900 dark:text-white shadow-md">
                    <ImagePlus className="h-4 w-4" /> Change Image
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="flex items-center gap-2 rounded-xl bg-red-600/90 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center p-6 text-gray-400 dark:text-zinc-500 group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-500">
                  <Camera className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-gray-800 dark:text-zinc-300">
                  Click to upload cover image
                </p>
                <p className="text-xs mt-1 text-gray-400 dark:text-zinc-500">
                  SVG, PNG, JPG or WEBP (Max 5MB • Rec. 1200x800px)
                </p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Title Input */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2"
          >
            Blog Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a captivating title..."
            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all font-medium text-lg"
            required
          />
        </div>

        {/* Short Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2"
          >
            Short Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="A short summary that appears on blog preview cards..."
            rows="3"
            maxLength="500"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all resize-none text-sm"
          />
        </div>

        {/* Tags Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
            Tags
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-gray-400 dark:text-zinc-500 pointer-events-none">
              <Tag className="h-4 w-4" />
            </div>
            <input
              type="text"
              name="tags"
              placeholder="e.g. technology, react, webdev (comma separated)"
              value={formData.tags}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-sm"
            />
          </div>
        </div>

        {/* Story Editor Section */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300">
            Story Content <span className="text-red-500">*</span>
          </label>
          <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 min-h-[420px] transition-all">
            <ReactQuill
              theme="bubble"
              value={formData.content}
              onChange={(val) => setFormData({ ...formData, content: val })}
              placeholder="Tell your story... (Select text to format with bubble menu)"
              className="h-full min-h-[380px] w-full text-lg leading-relaxed text-gray-800 dark:text-zinc-100 [&_.ql-editor.ql-blank::before]:text-gray-400 dark:[&_.ql-editor.ql-blank::before]:text-zinc-500 [&_.ql-editor]:min-h-[380px] [&_.ql-editor]:px-0"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-gray-200 dark:border-zinc-800/80 pt-6">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>Save as Draft</span>
          </button>

          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold px-6 py-3 text-sm transition-all duration-200 shadow-md shadow-yellow-500/10 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <span>Publish Story</span>
                <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};