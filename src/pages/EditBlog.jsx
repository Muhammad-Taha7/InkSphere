import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, Save, Send, ArrowLeft } from 'lucide-react';
import { fetchBlog, updateBlog } from '../store/slices/blogSlice.jsx';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.bubble.css';
import toast from 'react-hot-toast';

export const EditBlog = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    description: '',
    tags: '',
    isPublished: true
  });
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentBlog, isLoading } = useSelector(state => state.blogs);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchBlog(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentBlog) {
      // Check ownership
      if (currentBlog.author._id !== user?.id) {
        navigate('/profile/my-blogs');
        return;
      }

      setFormData({
        title: currentBlog.title || '',
        content: currentBlog.content || '',
        description: currentBlog.description || '',
        tags: currentBlog.tags ? currentBlog.tags.join(', ') : '',
        isPublished: currentBlog.isPublished
      });
      if (currentBlog.coverImage) {
        setPreviewUrl(currentBlog.coverImage);
      }
    }
  }, [currentBlog, user, navigate]);

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

  const handleSubmit = (e, isPublished = true) => {
    e.preventDefault();
    if (!formData.title || !formData.content || formData.content === '<p><br></p>') {
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

    dispatch(updateBlog({ id, formData: submitData })).unwrap().then(() => {
      toast.success(isPublished ? 'Story updated and published!' : 'Draft saved!');
      navigate('/profile/my-blogs');
    }).catch(err => {
      toast.error(err.message || 'Error updating blog');
    });
  };

  if (isLoading && !currentBlog) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center gap-4">
        <Link to="/profile/my-blogs" className="rounded-full bg-gray-100 p-2 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Edit Story</h2>
      </div>

      <form className="space-y-6">
        {/* Cover Image */}
        <div 
          className="group relative flex h-64 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-yellow-400"
          onClick={() => fileInputRef.current?.click()}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Cover preview" className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-50" />
          ) : (
            <div className="text-center text-gray-400 group-hover:text-yellow-500">
              <Camera className="mx-auto mb-2 h-8 w-8" />
              <p className="text-sm font-medium">Add Cover Image</p>
              <p className="text-xs mt-1 text-gray-400">Recommended: 1200x800px</p>
            </div>
          )}
          {previewUrl && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <span className="rounded-lg bg-black/70 px-4 py-2 text-sm font-medium text-white shadow-sm">Change Cover</span>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>

        {/* Title Input */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Blog Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a captivating title..."
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            required
          />
        </div>

        {/* Description Input */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="A brief summary for the blog card..."
            rows="2"
            maxLength="500"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all resize-none"
          ></textarea>
        </div>

        {/* Tags */}
        <div>
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated, e.g. travel, culture, food)"
            value={formData.tags}
            onChange={handleChange}
            className="w-full border-b border-gray-200 bg-transparent py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-yellow-500 focus:outline-none"
          />
        </div>

        {/* Content Area */}
        <div className="min-h-[400px] border-b border-gray-200 pb-10">
          <ReactQuill
            theme="bubble"
            value={formData.content}
            onChange={(val) => setFormData({ ...formData, content: val })}
            placeholder="Tell your story... (Highlight text to format)"
            className="h-full min-h-[400px] w-full font-serif text-xl leading-relaxed text-gray-800 [&_.ql-editor.ql-blank::before]:text-gray-400 [&_.ql-editor.ql-blank::before]:font-sans [&_.ql-editor]:min-h-[400px] [&_.ql-editor]:px-0"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-md px-6 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Save as Draft
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-md bg-yellow-400 px-6 py-2.5 text-sm font-bold text-black transition-colors hover:bg-yellow-500 disabled:opacity-50 shadow-sm"
          >
            {isLoading ? 'Saving...' : 'Update & Publish'}
            {!isLoading && <Send className="h-4 w-4" />}
          </button>
        </div>
      </form>
    </div>
  );
};
