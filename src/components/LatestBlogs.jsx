import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, MessageSquare } from 'lucide-react';
import { fetchBlogs } from '../store/slices/blogSlice.jsx';

export const LatestBlogs = () => {
  const dispatch = useDispatch();
  const { blogs, isLoading } = useSelector(state => state.blogs);

  useEffect(() => {
    // Fetch latest 4 published blogs
    dispatch(fetchBlogs({ limit: 4 }));
  }, [dispatch]);

  return (
    <section className="w-full bg-white dark:bg-zinc-950 px-6 py-24 border-t border-gray-100 dark:border-zinc-900 transition-colors duration-300">
      {/* Title Header */}
      <div className="mx-auto flex max-w-[1600px] flex-col justify-between mb-16 gap-6 sm:flex-row sm:items-end">
        <div>
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.3em] text-yellow-500">
            Fresh Off The Press
          </span>
          <h2 className="font-serif text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            Latest Journals
          </h2>
        </div>
        
        <Link 
          to="/blogs"
          className="group flex items-center gap-2 text-sm font-bold text-yellow-500 transition-colors hover:text-yellow-600"
        >
          VIEW ALL ARTICLES
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Grid */}
      {isLoading && blogs.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-yellow-400"></div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          No articles published yet.
        </div>
      ) : (
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {blogs.map((blog, index) => (
            <Link
              key={blog._id}
              to={`/blogs/${blog._id}`}
              className="group flex flex-col overflow-hidden rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400/50 hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative h-56 w-full overflow-hidden bg-gray-100 dark:bg-zinc-950">
                {blog.coverImage ? (
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400 dark:text-gray-500">No Image</div>
                )}
                
                {/* Yellow Accent Line on Hover */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-yellow-400 transition-all duration-500 ease-out group-hover:w-full" />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                {/* Author & Date */}
                <div className="mb-4 flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-2">
                    <img 
                      src={blog.author?.avatar || 'https://via.placeholder.com/20'} 
                      alt={blog.author?.name} 
                      className="h-5 w-5 rounded-full object-cover border border-gray-200 dark:border-zinc-700" 
                    />
                    {blog.author?.name}
                  </span>
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>

                <h3 className="mb-3 font-serif text-xl font-bold leading-snug text-gray-900 dark:text-white transition-colors group-hover:text-yellow-600">
                  {blog.title}
                </h3>

                <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
                  {blog.content.replace(/<[^>]+>/g, '')}
                </p>

                {/* Footer Stats */}
                <div className="mt-auto flex items-center gap-4 border-t border-gray-100 dark:border-zinc-800 pt-4 text-xs font-semibold text-gray-400 dark:text-gray-500">
                  <span className="flex items-center gap-1.5 transition-colors group-hover:text-gray-900 dark:group-hover:text-white">
                    <Eye className="h-4 w-4" /> {blog.likesCount}
                  </span>
                  <span className="flex items-center gap-1.5 transition-colors group-hover:text-gray-900 dark:group-hover:text-white">
                    <MessageSquare className="h-4 w-4" /> {blog.commentsCount}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default LatestBlogs;