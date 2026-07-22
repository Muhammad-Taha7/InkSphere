import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchBlog, toggleLike, addComment, clearCurrentBlog, receiveComment, receiveLikeUpdate } from '../store/slices/blogSlice.jsx';
import { Heart, MessageSquare, Share2, ArrowLeft, Send, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal.jsx';
import { useSocket } from '../context/SocketProvider.jsx';
import toast from 'react-hot-toast';

export const BlogDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentBlog, isLoading } = useSelector(state => state.blogs);
  const { user, token } = useSelector(state => state.auth);
  
  const [commentText, setCommentText] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [visibleLines, setVisibleLines] = useState(10);
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

  const handleReadMore = () => {
    setVisibleLines(prev => prev + 10);
  };

  const handleShowLess = () => {
    setVisibleLines(prev => Math.max(10, prev - 10));
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

  const blogAuthorId = currentBlog?.author?._id;
  const maxHeightInPx = visibleLines * 28;

  return (
    <article className="min-h-screen bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 pb-24 selection:bg-yellow-400 selection:text-black w-full transition-colors duration-300">
      
      {/* Hero Banner Header */}
      <header className="relative min-h-[45vh] md:min-h-[55vh] w-full bg-gray-100 dark:bg-zinc-900 flex items-end">
        {currentBlog?.coverImage && (
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={currentBlog.coverImage}
              alt={currentBlog.title}
              className="h-full w-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}
        
        <div className="relative z-10 w-full px-6 sm:px-12 lg:px-16 pb-10 pt-10">
          <div className="max-w-7xl mx-auto">
            
            {/* Embedded Clean "Back to Journal" Button */}
            <div className="mb-8">
              <Link 
                to="/blogs" 
                className="inline-flex items-center gap-2 rounded-full bg-black/40 hover:bg-black/60 px-4 py-2 text-xs font-medium text-white backdrop-blur-md transition-all border border-white/20 hover:border-white/40"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> 
                <span>Back to Journal</span>
              </Link>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {currentBlog?.tags?.map((tag, i) => (
                <span key={i} className="rounded-full bg-yellow-400/10 border border-yellow-400/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-yellow-400 backdrop-blur-md">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="mb-4 font-serif text-2xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl leading-tight max-w-4xl">
              {currentBlog?.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-gray-200">
              <div className="flex items-center gap-2">
                <img
                  src={currentBlog?.author?.avatar || 'https://via.placeholder.com/50'}
                  alt={currentBlog?.author?.name || 'Author'}
                  className="h-8 w-8 rounded-full border border-yellow-400 object-cover"
                />
                <span className="font-semibold text-white">{currentBlog?.author?.name || 'Deleted User'}</span>
              </div>
              <span className="h-1 w-1 rounded-full bg-gray-400" />
              <div className="flex items-center gap-1.5 text-neutral-300">
                <Calendar className="h-3.5 w-3.5 text-yellow-400" />
                <span>
                  {currentBlog?.createdAt ? new Date(currentBlog.createdAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  }) : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main 2-Column Split Layout */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT SIDE: Blog Body Content */}
          <div className="lg:col-span-8">
            
            {/* Summary Box */}
            {currentBlog?.description && (
              <section className="mb-8 relative overflow-hidden rounded-xl border-l-4 border-yellow-400 bg-gray-50 dark:bg-zinc-900/40 p-5 shadow-sm border border-gray-100 dark:border-zinc-900">
                <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-600 mb-1">
                  Summary Overview
                </p>
                <p className="font-serif text-sm sm:text-base font-medium leading-relaxed italic text-gray-700 dark:text-zinc-300">
                  "{currentBlog.description}"
                </p>
              </section>
            )}

            {/* Primary Article Content */}
            <div className="relative">
              <div 
                style={{ maxHeight: `${maxHeightInPx}px` }}
                className="prose prose-sm sm:prose-base max-w-full font-serif text-gray-700 dark:text-zinc-300 
                  overflow-hidden transition-all duration-500 ease-in-out
                  prose-headings:font-sans prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                  prose-h1:text-xl prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-3
                  prose-p:mb-4 prose-p:text-sm prose-p:leading-7 prose-p:tracking-normal
                  prose-a:text-yellow-600 prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-l-yellow-400 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-zinc-900/50 dark:prose-blockquote:text-zinc-300 prose-blockquote:py-2.5 prose-blockquote:px-5 prose-blockquote:my-5 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-xs
                  prose-img:rounded-xl prose-img:border prose-img:border-gray-200 dark:prose-img:border-zinc-800 prose-img:my-5 prose-img:w-full"
                dangerouslySetInnerHTML={{ __html: currentBlog?.content || '' }}
              />

              {/* 10-Line Incremental Controls */}
              <div className="mt-6 flex items-center justify-center gap-3 border-t border-gray-100 dark:border-zinc-900 pt-6">
                {visibleLines > 10 && (
                  <button 
                    onClick={handleShowLess}
                    className="flex items-center gap-1.5 rounded-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300 shadow-sm hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                  >
                    <ChevronUp className="h-3.5 w-3.5" /> Show Less
                  </button>
                )}

                <button 
                  onClick={handleReadMore}
                  className="flex items-center gap-1.5 rounded-full bg-yellow-400 px-6 py-2 text-[11px] font-bold uppercase tracking-wider text-black shadow-md hover:bg-yellow-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Read More (+10 Lines) <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Author Info Banner */}
            <div className="mt-12 flex items-center gap-5 rounded-xl bg-gray-50 dark:bg-zinc-900/30 border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
              <img
                src={currentBlog?.author?.avatar || 'https://via.placeholder.com/80'}
                alt={currentBlog?.author?.name || 'Author'}
                className="h-16 w-16 rounded-full border-2 border-yellow-400 object-cover shrink-0"
              />
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-yellow-600">Written by</span>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">{currentBlog?.author?.name || 'Deleted User'}</h3>
                <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed mt-0.5">
                  {currentBlog?.author?.bio || 'An avid storyteller sharing moments, insights, and perspectives from around the world.'}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Controls & Comments Panel */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-8 space-y-6">
              
              {/* Interaction Box (Likes & Share) */}
              <div className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 p-4 shadow-sm">
                <button
                  onClick={handleLike}
                  disabled={isLiking}
                  className={`flex items-center gap-2 text-xs font-semibold transition-all ${
                    currentBlog?.hasLiked ? 'text-red-500 scale-105' : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${currentBlog?.hasLiked ? 'fill-current' : ''}`} />
                  <span>{currentBlog?.likesCount || 0} Likes</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 rounded-full bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-zinc-300 transition-all border border-gray-200 dark:border-zinc-700 shadow-xs"
                >
                  <Share2 className="h-3.5 w-3.5" /> Share
                </button>
              </div>

              {/* Comments Container */}
              <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5 shadow-sm">
                <h3 className="mb-4 font-serif text-lg font-bold text-gray-900 dark:text-white flex items-center justify-between">
                  <span>Responses</span>
                  <span className="rounded-full bg-gray-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-sans font-medium text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-zinc-800">
                    {currentBlog?.commentsCount || 0}
                  </span>
                </h3>

                {/* Comment Input Box */}
                <div className="mb-6">
                  {token ? (
                    <form onSubmit={submitComment}>
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="What are your thoughts?"
                        className="w-full resize-none rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 p-3 text-xs text-gray-900 dark:text-zinc-100 placeholder-gray-400 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-all shadow-xs"
                        rows="3"
                      />
                      <div className="mt-2 flex justify-end">
                        <button
                          type="submit"
                          disabled={!commentText.trim()}
                          className="flex items-center gap-1.5 rounded-full bg-yellow-400 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-black transition-all hover:bg-yellow-500 disabled:opacity-40 cursor-pointer"
                        >
                          Comment <Send className="h-3 w-3" />
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center py-4 bg-gray-50 dark:bg-zinc-900/50 rounded-lg border border-dashed border-gray-200 dark:border-zinc-800">
                      <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">Log in to add a response.</p>
                      <Link to="/auth" className="inline-block rounded-full bg-yellow-400 px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-black hover:bg-yellow-500">
                        Sign In
                      </Link>
                    </div>
                  )}
                </div>

                {/* Comments List */}
                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                  {!currentBlog?.comments || currentBlog.comments.length === 0 ? (
                    <div className="py-4 text-center text-xs text-gray-400">
                      No responses yet.
                    </div>
                  ) : (
                    [...currentBlog.comments]
                      .sort((a, b) => {
                        const isAAuthor = Boolean(blogAuthorId && a.author?._id === blogAuthorId);
                        const isBAuthor = Boolean(blogAuthorId && b.author?._id === blogAuthorId);
                        if (isAAuthor && !isBAuthor) return -1;
                        if (!isAAuthor && isBAuthor) return 1;
                        return new Date(b.createdAt) - new Date(a.createdAt);
                      })
                      .map((comment) => {
                        const isAuthor = Boolean(blogAuthorId && comment.author?._id === blogAuthorId);
                        return (
                          <div 
                            key={comment._id} 
                            className={`p-3 rounded-lg border text-xs ${
                              isAuthor ? 'border-yellow-300/50 dark:border-yellow-500/20 bg-yellow-50/40 dark:bg-yellow-500/5' : 'border-gray-100 dark:border-zinc-800/80 bg-gray-50/50 dark:bg-zinc-900/30'
                            }`}
                          >
                            <div className="mb-1.5 flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <img
                                  src={comment.author?.avatar || 'https://via.placeholder.com/30'}
                                  alt={comment.author?.name || 'User'}
                                  className="h-6 w-6 rounded-full object-cover"
                                />
                                <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[100px]">
                                  {comment.author?.name || 'Deleted User'}
                                </span>
                                {isAuthor && (
                                  <span className="rounded bg-yellow-400 px-1 py-0.2 text-[8px] font-bold uppercase text-black">
                                    Author
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-gray-400">
                                {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-zinc-300 leading-relaxed pl-7.5">{comment.content}</p>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
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