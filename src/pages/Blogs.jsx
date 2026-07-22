import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, ChevronLeft, Eye, MessageSquare } from 'lucide-react';
import { fetchBlogs } from '../store/slices/blogSlice.jsx';

export const Blogs = () => {
  const dispatch = useDispatch();
  const { blogs, pagination, isLoading } = useSelector(state => state.blogs);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [page, setPage] = useState(1);

  // Example tags - in a real app, these might come from an API
  const popularTags = ['travel', 'culture', 'photography', 'food', 'lifestyle', 'nature'];

  useEffect(() => {
    dispatch(fetchBlogs({ page, limit: 12, search: searchTerm, tag: activeTag }));
  }, [dispatch, page, searchTerm, activeTag]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    dispatch(fetchBlogs({ page: 1, limit: 12, search: searchTerm, tag: activeTag }));
  };

  const handleTagClick = (tag) => {
    const newTag = activeTag === tag ? '' : tag;
    setActiveTag(newTag);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Header Section */}
      <section className="bg-white dark:bg-zinc-900 px-6 py-20 text-gray-900 dark:text-zinc-100 md:px-12 lg:px-20 border-b border-gray-100 dark:border-zinc-800">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 font-serif text-5xl font-black uppercase tracking-widest md:text-7xl text-gray-900 dark:text-white">
            Journal
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-500 dark:text-gray-400 md:text-xl">
            Explore our collection of stories, guides, and thoughtful pieces on travel and culture.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mx-auto mt-10 max-w-xl relative">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 py-4 pl-6 pr-14 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:border-yellow-400 focus:outline-none focus:bg-white dark:focus:bg-zinc-900 transition-colors shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-yellow-400 p-2.5 text-black transition-colors hover:bg-yellow-500"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>

          {/* Tags */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {popularTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  activeTag === tag
                    ? 'bg-yellow-400 text-black shadow-sm border border-yellow-400'
                    : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-850 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="mx-auto max-w-[1600px] px-6 py-16 md:px-12 lg:px-20">
        {isLoading && blogs.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-yellow-400"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-20 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">No articles found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-450">Try adjusting your search or filters.</p>
            <button
              onClick={() => { setSearchTerm(''); setActiveTag(''); setPage(1); }}
              className="mt-6 font-bold text-yellow-500 hover:text-yellow-600 hover:underline transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-24 py-10">
              {blogs.map((blog, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div key={blog._id} className={`flex flex-col md:flex-row items-center gap-8 lg:gap-16 ${isEven ? '' : 'md:flex-row-reverse'}`}>
                    
                    {/* Image Section */}
                    <Link
                      to={`/blogs/${blog._id}`}
                      className="group relative w-full md:w-1/2 shrink-0 overflow-hidden rounded-3xl bg-gray-100 dark:bg-zinc-900 shadow-lg hover:shadow-2xl transition-all duration-500"
                    >
                      <div className="aspect-[4/3] w-full">
                        {blog.coverImage ? (
                          <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-gray-400 dark:text-gray-500 font-medium">No Image Available</div>
                        )}
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                        
                        {/* Tags overlay */}
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="absolute left-6 top-6 flex flex-wrap gap-2">
                            {blog.tags.slice(0, 2).map((t, i) => (
                              <span key={i} className="rounded-full bg-white/90 dark:bg-zinc-900/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-zinc-200 backdrop-blur-md shadow-sm">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Content Section */}
                    <div className={`w-full md:w-1/2 flex flex-col justify-center ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                      <div className="mb-6 flex items-center gap-4">
                        <img
                          src={blog.author?.avatar || 'https://via.placeholder.com/40'}
                          alt={blog.author?.name}
                          className="h-10 w-10 rounded-full object-cover border-2 border-yellow-400 shadow-sm"
                        />
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{blog.author?.name}</p>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                      </div>

                      <Link to={`/blogs/${blog._id}`} className="group">
                        <h3 className="mb-4 font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] text-gray-900 dark:text-white transition-colors group-hover:text-yellow-600">
                          {blog.title}
                        </h3>
                      </Link>

                      <p className="mb-8 text-base md:text-lg leading-relaxed text-gray-600 dark:text-zinc-400 line-clamp-3">
                        {blog.description || blog.content.replace(/<[^>]+>/g, '')}
                      </p>

                      <div className="flex items-center gap-6 mt-auto text-sm font-semibold text-gray-500">
                        <span className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-white transition-colors cursor-default">
                          <Eye className="h-5 w-5 text-gray-400" /> {blog.likesCount || 0}
                        </span>
                        <span className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-white transition-colors cursor-default">
                          <MessageSquare className="h-5 w-5 text-gray-400" /> {blog.commentsCount || 0}
                        </span>
                        
                        <Link 
                          to={`/blogs/${blog._id}`}
                          className="ml-auto inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-yellow-500 hover:text-yellow-600 transition-colors"
                        >
                          Read Story <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};
