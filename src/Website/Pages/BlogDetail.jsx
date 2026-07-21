import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchBlog, toggleLike, addComment, clearCurrentBlog, receiveComment, receiveLikeUpdate } from '../Store/Slices/blogSlice.jsx';
import { Heart, MessageSquare, Share2, ArrowLeft, Send, Bookmark, Calendar, Clock } from 'lucide-react';
import ConfirmModal from '../Components/ConfirmModal.jsx';
import { useSocket } from '../Context/SocketProvider.jsx';
import toast from 'react-hot-toast';

export const BlogDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentBlog, isLoading } = useSelector(state => state.blogs);
  const { user, token } = useSelector(state => state.auth);
  
  const [commentText, setCommentText] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [authModal, setAuthModal] = useState({ isOpen: false, action: '' });
  const socket = useSocket();

  useEffect(() => {
    dispatch(fetchBlog(id));
    return () => {
      dispatch(clearCurrentBlog());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (socket && id) {
      socket.emit('join-blog', id);

      socket.on('new-comment', (data) => {
        dispatch(receiveComment(data));
      });

      socket.on('like-update', (data) => {
        dispatch(receiveLikeUpdate(data));
      });

      return () => {
        socket.off('new-comment');
        socket.off('like-update');
      };
    }
  }, [socket, id, dispatch]);

  const handleLike = async () => {
    if (!token) {
      setAuthModal({ isOpen: true, action: 'like' });
      return;
    }
    
    setIsLiking(true);
    await dispatch(toggleLike(id));
    setIsLiking(false);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: currentBlog?.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (err) {
      toast.error('Error sharing link');
    }
  };

  const submitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    if (!token) {
      setAuthModal({ isOpen: true, action: 'comment' });
      return;
    }

    dispatch(addComment({ id, content: commentText }));
    setCommentText('');
  };

  if (isLoading && !currentBlog) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-white dark:bg-zinc-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-yellow-400"></div>
      </div>
    );
  }

  if (!currentBlog && !isLoading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-white dark:bg-zinc-950 px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Article Not Found</h2>
        <p className="mb-8 text-gray-500">The story you're looking for doesn't exist or has been removed.</p>
        <Link to="/blogs" className="rounded-full bg-yellow-400 px-8 py-3 font-semibold text-black transition-all hover:bg-yellow-500 shadow-sm hover:shadow-md">
          Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 pb-24 selection:bg-yellow-400 selection:text-black w-full transition-colors duration-300">
      <style>{`
        .blog-content-collapsed {
          max-height: 420px;
          overflow: hidden;
          position: relative;
        }
      `}</style>

      {/* Navigation Top Overlay */}
      <div className="fixed top-6 left-6 z-50">
        <Link 
          to="/blogs" 
          className="group flex items-center gap-2 rounded-full bg-white/90 dark:bg-zinc-900/90 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-zinc-300 backdrop-blur-md transition-all border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white shadow-sm"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> 
          <span>Back to Journal</span>
        </Link>
      </div>

      {/* Hero Section */}
      <header className="relative min-h-[60vh] md:min-h-[75vh] w-full bg-gray-100 dark:bg-zinc-900 flex items-end">
        {currentBlog?.coverImage && (
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={currentBlog.coverImage}
              alt={currentBlog.title}
              className="h-full w-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}
        
        <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 xl:px-32 pb-16 pt-28 text-center">
          {/* Tags */}
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {currentBlog?.tags?.map((tag, i) => (
              <span key={i} className="rounded-full bg-yellow-400/10 border border-yellow-400/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-yellow-400 backdrop-blur-md">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mb-8 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl leading-[1.2]">
            {currentBlog?.title}
          </h1>

          {/* Author & Metadata */}
          <div className="flex flex-wrap items-center justify-center gap-6 border-t border-white/20 pt-8 text-sm text-gray-200">
            <div className="flex items-center gap-3">
              <img
                src={currentBlog?.author?.avatar || 'https://via.placeholder.com/50'}
                alt={currentBlog?.author?.name}
                className="h-11 w-11 rounded-full border-2 border-yellow-400 object-cover shadow-md"
              />
              <div className="text-left">
                <p className="font-semibold text-white leading-tight">{currentBlog?.author?.name}</p>
                <p className="text-xs text-gray-300">@{currentBlog?.author?.username || 'author'}</p>
              </div>
            </div>

            <span className="hidden h-1 w-1 rounded-full bg-gray-400 sm:block" />

            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <Calendar className="h-4 w-4 text-yellow-400" />
              <span>
                {new Date(currentBlog?.createdAt).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Full-Width Content Container */}
      <main className="w-full px-6 sm:px-12 lg:px-20 xl:px-32 pt-12">
        
        {/* Sticky Interactive Bar */}
        <div className="sticky top-6 z-40 mb-16 flex items-center justify-between rounded-full border border-gray-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 px-8 py-3.5 backdrop-blur-md shadow-md text-gray-700 dark:text-zinc-300">
          <div className="flex items-center gap-8">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-2.5 text-sm font-medium transition-all ${
                currentBlog?.hasLiked ? 'text-red-500 scale-105' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Heart className={`h-5 w-5 transition-transform active:scale-125 ${currentBlog?.hasLiked ? 'fill-current' : ''}`} />
              <span>{currentBlog?.likesCount || 0}</span>
            </button>
            <a href="#comments" className="flex items-center gap-2.5 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              <MessageSquare className="h-5 w-5" />
              <span>{currentBlog?.commentsCount || 0}</span>
            </a>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 px-4 py-2 text-xs font-medium text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white transition-all border border-gray-200 dark:border-zinc-700"
            >
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>
        </div>

        {/* Featured Description Highlight Box */}
        {currentBlog?.description && (
          <section className="mb-16 relative overflow-hidden rounded-2xl border-l-4 border-yellow-400 bg-gray-50 dark:bg-zinc-900/40 p-8 sm:p-10 shadow-sm border border-gray-100 dark:border-zinc-900">
            <p className="text-xs font-bold uppercase tracking-widest text-yellow-600 mb-4">
              Summary Overview
            </p>
            <p className="font-serif text-xl sm:text-2xl font-medium leading-relaxed italic text-gray-700 dark:text-zinc-300">
              "{currentBlog.description}"
            </p>
          </section>
        )}

        {/* Primary Article Body - Collapse state and "Read More" button */}
        <div className="relative">
          <div 
            className={`prose prose-xl max-w-full font-serif text-gray-700 dark:text-zinc-300 
              prose-headings:font-sans prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-h1:text-4xl prose-h2:text-3xl prose-h2:mt-14 prose-h2:mb-8
              prose-p:mb-8 prose-p:leading-9 sm:prose-p:leading-10 prose-p:tracking-wide
              prose-a:text-yellow-600 prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-yellow-400 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-zinc-900/50 dark:prose-blockquote:text-zinc-300 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:my-10 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-gray-800
              prose-img:rounded-2xl prose-img:border prose-img:border-gray-200 dark:prose-img:border-zinc-800 prose-img:my-10 prose-img:w-full
              ${!isExpanded ? 'blog-content-collapsed' : ''}`}
            dangerouslySetInnerHTML={{ __html: currentBlog?.content }}
          />
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-zinc-950 dark:via-zinc-950/80 flex items-end justify-center pb-4 z-10">
              <button 
                onClick={() => setIsExpanded(true)}
                className="rounded-full bg-yellow-400 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-black shadow-lg hover:bg-yellow-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Read More
              </button>
            </div>
          )}
        </div>

        {/* Author Bio Card */}
        <div className="mt-20 flex flex-col items-center gap-8 rounded-2xl bg-gray-50 dark:bg-zinc-900/30 border border-gray-200 dark:border-zinc-800 p-8 sm:p-12 text-center sm:flex-row sm:text-left shadow-sm">
          <img
            src={currentBlog?.author?.avatar || 'https://via.placeholder.com/100'}
            alt={currentBlog?.author?.name}
            className="h-24 w-24 rounded-full border-2 border-yellow-400 object-cover shrink-0"
          />
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-600">Written by</span>
            <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{currentBlog?.author?.name}</h3>
            <p className="text-base text-gray-600 dark:text-zinc-400 leading-relaxed">
              {currentBlog?.author?.bio || 'An avid storyteller sharing moments, insights, and perspectives from around the world.'}
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <section id="comments" className="mt-20 pt-12 border-t border-gray-200 dark:border-zinc-800">
          <h3 className="mb-10 font-serif text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-4">
            <span>Responses</span>
            <span className="rounded-full bg-gray-100 dark:bg-zinc-800 px-4 py-1 text-base font-sans font-medium text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-zinc-800">
              {currentBlog?.commentsCount || 0}
            </span>
          </h3>
          
          {/* Comment Input */}
          <div className="mb-12 rounded-2xl bg-gray-50 dark:bg-zinc-900/30 border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
            {token ? (
              <form onSubmit={submitComment}>
                <div className="flex gap-5">
                  <img
                    src={user?.avatar || 'https://via.placeholder.com/40'}
                    alt={user?.name}
                    className="h-12 w-12 shrink-0 rounded-full border border-gray-300 dark:border-zinc-700 object-cover"
                  />
                  <div className="flex-1">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="What are your thoughts on this story?"
                      className="w-full resize-none rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5 text-base text-gray-900 dark:text-zinc-100 placeholder-gray-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all shadow-sm"
                      rows="4"
                    />
                    <div className="mt-4 flex justify-end">
                      <button
                        type="submit"
                        disabled={!commentText.trim()}
                        className="flex items-center gap-2 rounded-full bg-yellow-400 px-7 py-3 text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-yellow-500 disabled:opacity-40 disabled:hover:bg-yellow-400 cursor-pointer"
                      >
                        Publish <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="mb-5 text-base text-gray-500 dark:text-gray-400">Join the discussion and express your thoughts.</p>
                <Link to="/auth" className="inline-block rounded-full bg-yellow-400 px-8 py-3 text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-yellow-500">
                  Sign In to Respond
                </Link>
              </div>
            )}
          </div>

          {/* Comments List */}
          <div className="space-y-8">
            {currentBlog?.comments?.length === 0 ? (
               <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                 No comments yet. Be the first to respond!
               </div>
            ) : (
              [...currentBlog.comments]
                .sort((a, b) => {
                  const isAAuthor = currentBlog.author._id === a.author._id;
                  const isBAuthor = currentBlog.author._id === b.author._id;
                  if (isAAuthor && !isBAuthor) return -1;
                  if (!isAAuthor && isBAuthor) return 1;
                  return new Date(b.createdAt) - new Date(a.createdAt);
                })
                .map((comment) => {
                const isAuthor = currentBlog.author._id === comment.author._id;
                return (
                  <div 
                    key={comment._id} 
                    className={`flex gap-5 border-b pb-8 last:border-0 ${
                      isAuthor ? 'border-yellow-200 dark:border-yellow-500/20 bg-yellow-50/50 dark:bg-yellow-500/5 p-6 rounded-2xl' : 'border-gray-200 dark:border-zinc-800'
                    }`}
                  >
                    <img
                      src={comment.author?.avatar || 'https://via.placeholder.com/40'}
                      alt={comment.author?.name}
                      className={`h-12 w-12 shrink-0 rounded-full object-cover ${
                        isAuthor ? 'border-2 border-yellow-400' : 'border border-gray-200 dark:border-zinc-800'
                      }`}
                    />
                    <div className="flex-1">
                      <div className="mb-2 flex items-baseline justify-between">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-base text-gray-900 dark:text-white">{comment.author?.name}</h4>
                          {isAuthor && (
                            <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-black">
                              Author
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-base text-gray-700 dark:text-zinc-300 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      <ConfirmModal 
        isOpen={authModal.isOpen}
        title="Authentication Required"
        message={`You need to be signed in to ${authModal.action} on this story.`}
        confirmText="Sign In"
        isDestructive={false}
        onConfirm={() => navigate('/auth')}
        onCancel={() => setAuthModal({ isOpen: false, action: '' })}
      />
    </article>
  );
};