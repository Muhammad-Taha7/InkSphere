import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.jsx';
import blogReducer from './slices/blogSlice.jsx';
import adminReducer from './slices/adminSlice.jsx';
import notificationReducer from './slices/notificationSlice.jsx';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blogs: blogReducer,
    admin: adminReducer,
    notifications: notificationReducer,
  },
});

export default store;