import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/authSlice.jsx';
import blogReducer from './Slices/blogSlice.jsx';
import adminReducer from './Slices/adminSlice.jsx';
import notificationReducer from './Slices/notificationSlice.jsx';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blogs: blogReducer,
    admin: adminReducer,
    notifications: notificationReducer,
  },
});

export default store;