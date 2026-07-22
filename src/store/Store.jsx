import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.jsx';
import blogReducer from './slices/blogSlice.jsx';
import adminReducer from './slices/adminSlice.jsx';
import notificationReducer from './slices/notificationSlice.jsx';
import themeReducer from './slices/themeSlice.jsx';
import socketReducer from './slices/socketSlice.jsx';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blogs: blogReducer,
    admin: adminReducer,
    notifications: notificationReducer,
    theme: themeReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['socket/setSocket'],
        ignoredPaths: ['socket.socket'],
      },
    }),
});

export default store;