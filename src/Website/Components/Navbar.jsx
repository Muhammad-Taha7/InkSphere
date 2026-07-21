import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { gsap } from 'gsap';
import { LogOut, User, Bell, Moon, Sun, Heart, MessageSquare } from 'lucide-react';
import { logout } from "../Store/Slices/authSlice.jsx";
import { useTheme } from '../Context/ThemeProvider.jsx';
import { useSocket } from '../Context/SocketProvider.jsx';
import { fetchNotifications, receiveNotification, markAsRead, markAllAsRead } from '../Store/Slices/notificationSlice.jsx';
import './Navbar.css';

export const Navbar = () => {
  const [active, setActive] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const openTl = useRef(null);
  const closeTl = useRef(null);
  const notifRef = useRef(null);
  const { user, token } = useSelector(state => state.auth);
  const { notifications, unreadCount } = useSelector(state => state.notifications);
  const { theme, toggleTheme } = useTheme();
  const socket = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (socket && token) {
      socket.on('new-notification', (notification) => {
        dispatch(receiveNotification(notification));
      });

      return () => {
        socket.off('new-notification');
      };
    }
  }, [socket, token, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Media query to calculate responsive clipPath anchor point
    const isMobile = window.innerWidth <= 768;
    const clipOrigin = isMobile ? "calc(100% - 38px) 30px" : "calc(100% - 48px) 34px";

    openTl.current = gsap.timeline({ paused: true })
      .set(".menu-btn", { pointerEvents: "none" })
      .to(".fullscreen-nav", {
        clipPath: `circle(200% at ${clipOrigin})`,
        duration: 1.2,
        ease: "power4.out",
      }, 0)
      .to(".nav-li", {
        x: 0,
        opacity: 1,
        pointerEvents: "all",
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
      }, 0.2)
      .to(".menu-btn .close-icon", {
        opacity: 1,
        yPercent: -125,
        duration: 0.8,
        ease: "power4.out",
      }, 0)
      .to(".menu-btn .line-icon", {
        opacity: 0,
        yPercent: -125,
        duration: 0.8,
        ease: "power4.out",
      }, 0)
      .set(".menu-btn", { pointerEvents: "all" });

    closeTl.current = gsap.timeline({ paused: true })
      .set(".menu-btn", { pointerEvents: "none" })
      .to(".nav-li", {
        x: -100,
        opacity: 0,
        pointerEvents: "none",
        duration: 0.5,
        stagger: 0.05,
        ease: "power3.in",
      }, 0)
      .to(".fullscreen-nav", {
        clipPath: `circle(0px at ${clipOrigin})`,
        duration: 0.9,
        ease: "power4.inOut",
      }, 0.1)
      .to(".menu-btn .close-icon", {
        opacity: 0,
        yPercent: 125,
        duration: 0.7,
        ease: "power4.out",
      }, 0)
      .to(".menu-btn .line-icon", {
        opacity: 1,
        yPercent: 0,
        duration: 0.7,
        ease: "power4.out",
      }, 0)
      .set(".menu-btn", { pointerEvents: "all" });

    return () => {
      if (openTl.current) openTl.current.kill();
      if (closeTl.current) closeTl.current.kill();
    };
  }, []);

  const toggleMenu = () => {
    if (!active) {
      openTl.current.seek(0).play();
    } else {
      closeTl.current.seek(0).play();
    }
    setActive(!active);
  };

  const closeMenu = () => {
    if (active) {
      closeTl.current.seek(0).play();
      setActive(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
    navigate('/');
  };

  return (
    <>
      <nav className="relative z-50 bg-white dark:bg-zinc-950 px-4 py-3 text-gray-900 dark:text-zinc-100 md:px-9 md:py-4 border-b border-gray-100 dark:border-zinc-900 transition-colors duration-300">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-xl md:text-2xl font-bold tracking-[0.2em] z-50 relative uppercase">
            <Link
              to="/"
              onClick={closeMenu}
              className="transition-colors duration-300 hover:text-yellow-400 flex items-center gap-2"
            >
              <div className="h-6 w-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <div className="h-2 w-2 bg-white dark:bg-zinc-950 rounded-full" />
              </div>
              <span className="text-gray-900 dark:text-white font-black">INKSPHERE</span>
            </Link>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-4 md:gap-6 z-50 relative">
            
         
            {token ? (
              <div className="hidden md:flex items-center gap-4">
                {/* Notifications Dropdown Dialog Box */}
                <div className="relative" ref={notifRef}>
                  <button 
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-yellow-500 transition-colors cursor-pointer"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Box */}
                  {isNotifOpen && (
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* Dropdown Header */}
                      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-900 dark:text-white">Notifications</span>
                          {unreadCount > 0 && (
                            <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-bold text-black">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => dispatch(markAllAsRead())}
                            className="text-xs font-semibold text-yellow-500 hover:text-yellow-600 transition-colors"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      {/* Dropdown Body */}
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((notif) => {
                            const senderName = notif.sender?.username || notif.sender?.name || 'a user';
                            const message = notif.type === 'like'
                              ? `You have a like from ${senderName}`
                              : `You have got a comment from the user ${senderName}`;
                            
                            return (
                              <div
                                key={notif._id}
                                onClick={() => {
                                  dispatch(markAsRead(notif._id));
                                  setIsNotifOpen(false);
                                  if (notif.blog?._id || notif.blog) {
                                    navigate(`/blogs/${notif.blog?._id || notif.blog}`);
                                  }
                                }}
                                className={`flex items-start gap-3 px-4 py-3.5 border-b border-gray-50 dark:border-zinc-800/30 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer ${
                                  !notif.isRead ? 'bg-yellow-50/20 dark:bg-yellow-500/5' : ''
                                }`}
                              >
                                <img
                                  src={notif.sender?.avatar || 'https://via.placeholder.com/32'}
                                  alt={senderName}
                                  className="h-8 w-8 rounded-full object-cover border border-gray-200 dark:border-zinc-700"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs leading-normal ${!notif.isRead ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-600 dark:text-gray-300'}`}>
                                    {message}
                                  </p>
                                  {notif.blog?.title && (
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 truncate">
                                      on: {notif.blog.title}
                                    </p>
                                  )}
                                  <span className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5 block">
                                    {new Date(notif.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                {!notif.isRead && (
                                  <span className="h-2 w-2 rounded-full bg-yellow-400 mt-1.5 shrink-0" />
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {user?.role === 'admin' && (
                  <Link to="/run/Dashboard">
                    <button className="rounded-md bg-gray-900 dark:bg-zinc-800 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-gray-800 dark:hover:bg-zinc-700">
                      Admin Panel
                    </button>
                  </Link>
                )}
                <Link to="/profile/create">
                  <button className="rounded-md border border-yellow-400 bg-transparent px-5 py-2 text-sm font-semibold text-yellow-500 transition-all duration-300 hover:bg-yellow-400 hover:text-black">
                    Write Story
                  </button>
                </Link>
                <Link to="/profile" className="flex items-center gap-2 group">
                  <img 
                    src={user?.avatar || 'https://via.placeholder.com/40'} 
                    alt={user?.name} 
                    className="h-9 w-9 rounded-full object-cover border border-gray-200 dark:border-zinc-800 group-hover:border-yellow-400 transition-colors"
                  />
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                
                <Link to="/auth">
                  <button className="rounded-md bg-yellow-400 px-5 py-2 text-sm font-bold text-black transition-all duration-300 hover:bg-yellow-500">
                   Make your Blog
                  </button>
                </Link>
              </div>
            )}

            {/* Menu Button */}
            <button className="menu-btn border border-gray-200 dark:border-zinc-800" onClick={toggleMenu} aria-label="Toggle menu">
              <div className="btn--bg bg-yellow-400"></div>
              <div className="icons text-gray-900 mix-blend-difference">
                <svg viewBox="0 0 448 512" className="line-icon fill-current">
                  <path d="M0 96C0 78.33 14.33 64 32 64H416C433.7 64 448 78.33 448 96C448 113.7 433.7 128 416 128H32C14.33 128 0 113.7 0 96zM0 256C0 238.3 14.33 224 32 224H416C433.7 224 448 238.3 448 256C448 273.7 433.7 288 416 288H32C14.33 288 0 273.7 0 256zM416 448H32C14.33 448 0 433.7 0 416C0 398.3 14.33 384 32 384H416C433.7 384 448 398.3 448 416C448 433.7 433.7 448 416 448z" />
                </svg>
                <svg viewBox="0 0 320 512" className="close-icon fill-current">
                  <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Fullscreen Overlay Menu */}
      <nav className="fullscreen-nav bg-gray-50 dark:bg-zinc-900">
        <ul className="pl-6 md:pl-20">
          <li className="nav-li" onClick={closeMenu}>
            <NavLink to="/" style={{ textDecoration: 'none' }}>
              <span className="nav-span text-gray-900 dark:text-white hover:text-yellow-500 transition-colors">Home</span>
            </NavLink>
          </li>
          <li className="nav-li" onClick={closeMenu}>
            <NavLink to="/blogs" style={{ textDecoration: 'none' }}>
              <span className="nav-span text-gray-900 dark:text-white hover:text-yellow-500 transition-colors">Journal</span>
            </NavLink>
          </li>
          
          {token ? (
            <>
              {user?.role === 'admin' && (
                <li className="nav-li" onClick={closeMenu}>
                  <NavLink to="/run/Dashboard" style={{ textDecoration: 'none' }}>
                    <span className="nav-span text-gray-900 dark:text-white hover:text-yellow-500 transition-colors">Admin Panel</span>
                  </NavLink>
                </li>
              )}
              <li className="nav-li" onClick={closeMenu}>
                <NavLink to="/profile" style={{ textDecoration: 'none' }}>
                  <span className="nav-span text-gray-900 dark:text-white hover:text-yellow-500 transition-colors">Dashboard</span>
                </NavLink>
              </li>
              <li className="nav-li md:hidden" onClick={closeMenu}>
                <NavLink to="/profile/create" style={{ textDecoration: 'none' }}>
                  <span className="nav-span text-gray-900 dark:text-white hover:text-yellow-500 transition-colors text-3xl">Write Story</span>
                </NavLink>
              </li>
              <li className="nav-li mt-12" onClick={handleLogout}>
                <span className="nav-span flex items-center gap-4 text-3xl text-red-500 hover:text-red-400 cursor-pointer">
                  <LogOut className="h-8 w-8" /> Logout
                </span>
              </li>
            </>
          ) : (
            <li className="nav-li mt-12" onClick={closeMenu}>
              <NavLink to="/auth" style={{ textDecoration: 'none' }}>
                <span className="nav-span flex items-center gap-4 text-3xl text-yellow-500 hover:text-yellow-600">
                  <User className="h-8 w-8" /> Sign In
                </span>
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;