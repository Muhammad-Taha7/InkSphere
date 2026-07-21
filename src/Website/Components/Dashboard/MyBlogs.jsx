import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, PlusCircle, FileText, MessageSquare } from 'lucide-react';
import { fetchMyBlogs, deleteBlog } from "../../Store/Slices/blogSlice.jsx";
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

  if (isLoading && myBlogs.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Blogs</h2>
        <Link
          to="/profile/create"
          className="flex items-center gap-2 rounded-md bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-yellow-500 shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          Create New
        </Link>
      </div>

      {myBlogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 py-16 text-center">
          <FileText className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">No blogs yet</h3>
          <p className="mb-6 text-sm text-gray-500">You haven't written any blogs yet. Start sharing your stories!</p>
          <Link
            to="/profile/create"
            className="rounded-md border border-yellow-500 px-6 py-2 text-sm font-medium text-yellow-600 transition-colors hover:bg-yellow-500 hover:text-white"
          >
            Write your first blog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {myBlogs.map((blog) => (
            <div key={blog._id} className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-yellow-400 hover:shadow-lg shadow-sm">
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                {blog.coverImage ? (
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">No Image</div>
                )}
                
                {!blog.isPublished && (
                  <div className="absolute right-3 top-3 rounded bg-gray-900/70 px-2 py-1 text-xs font-semibold text-yellow-400 backdrop-blur-sm">
                    DRAFT
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <h3 className="mb-2 line-clamp-1 font-serif text-xl font-bold text-gray-900">{blog.title}</h3>
                
                <div className="mb-4 flex flex-wrap gap-2">
                  {blog.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex gap-3 text-gray-500 font-medium">
                    <span className="flex items-center gap-1 text-xs"><Eye className="h-3.5 w-3.5" /> {blog.likesCount}</span>
                    <span className="flex items-center gap-1 text-xs"><MessageSquare className="h-3.5 w-3.5" /> {blog.commentsCount}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link
                      to={`/profile/edit/${blog._id}`}
                      className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(blog._id)}
                      className="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        title="Delete Blog"
        message="Are you sure you want to delete this blog? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, blogId: null })}
      />
    </div>
  );
};


