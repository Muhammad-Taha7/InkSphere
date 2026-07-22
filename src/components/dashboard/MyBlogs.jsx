import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, PlusCircle, FileText, MessageSquare, ImageOff } from 'lucide-react';
import { fetchMyBlogs, deleteBlog } from '../../store/slices/blogSlice.jsx';
import ConfirmModal from '../ConfirmModal.jsx';

export const MyBlogs = () => {
  const dispatch = useDispatch();
  const { myBlogs, isLoading } = useSelector(state => state.blogs);

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, blogId: null });

  useEffect(() => {
    dispatch(fetchMyBlogs());
  }, [dispatch]);

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, blogId: id });
  };

  const confirmDelete = () => {
    if (deleteModal.blogId) {
      dispatch(deleteBlog(deleteModal.blogId));
    }
    setDeleteModal({ isOpen: false, blogId: null });
  };

  // Skeleton Loader for initial state
  if (isLoading && (!myBlogs || myBlogs.length === 0)) {
    return (
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-36 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-lg" />
          <div className="h-10 w-32 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-xl" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-4">
              <div className="h-44 w-full bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-xl" />
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded" />
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200 dark:border-zinc-800/80">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Blogs</h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Manage, edit or create new blog posts from here.
          </p>
        </div>
        <Link
          to="/profile/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-semibold px-4 py-2.5 text-sm transition-all duration-200 shadow-md shadow-yellow-500/10 shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create New</span>
        </Link>
      </div>

      {/* Empty State */}
      {!myBlogs || myBlogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 py-16 px-4 text-center">
          <div className="p-4 rounded-2xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 mb-4">
            <FileText className="h-10 w-10" />
          </div>
          <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">No blogs written yet</h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-zinc-400 max-w-sm">
            Start sharing your thoughts, guides, and stories with the community!
          </p>
          <Link
            to="/profile/create"
            className="inline-flex items-center gap-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-6 py-2.5 text-sm font-semibold text-yellow-600 dark:text-yellow-500 hover:bg-yellow-500 hover:text-zinc-950 transition-all duration-200"
          >
            <PlusCircle className="h-4 w-4" />
            Write your first blog
          </Link>
        </div>
      ) : (
        /* Blog Cards Responsive Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {myBlogs.map((blog) => (
            <div
              key={blog._id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-300 hover:border-yellow-500/50 hover:shadow-lg dark:hover:shadow-yellow-500/5"
            >
              <div>
                {/* Cover Image Container */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
                  {blog.coverImage ? (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-gray-400 dark:text-zinc-600">
                      <ImageOff className="h-8 w-8" />
                      <span className="text-xs">No Image Available</span>
                    </div>
                  )}

                  {/* Status Badge */}
                  {!blog.isPublished && (
                    <span className="absolute right-3 top-3 rounded-lg bg-zinc-950/80 px-2.5 py-1 text-[10px] font-bold tracking-wider text-yellow-500 backdrop-blur-md border border-yellow-500/20">
                      DRAFT
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="mb-2 line-clamp-2 font-semibold text-base text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors">
                    {blog.title}
                  </h3>

                  {/* Tags */}
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {blog.tags && blog.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-zinc-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between border-t border-gray-100 dark:border-zinc-800/80 p-4 pt-3.5 mt-auto">
                {/* Views & Comments Stats */}
                <div className="flex items-center gap-3 text-gray-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1 text-xs">
                    <Eye className="h-3.5 w-3.5 text-yellow-500" />
                    {blog.likesCount || 0}
                  </span>
                  <span className="flex items-center gap-1 text-xs">
                    <MessageSquare className="h-3.5 w-3.5 text-yellow-500" />
                    {blog.commentsCount || 0}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                  <Link
                    to={`/profile/edit/${blog._id}`}
                    className="p-2 rounded-lg text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                    title="Edit Blog"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(blog._id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                    title="Delete Blog"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Blog"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, blogId: null })}
      />
    </div>
  );
};