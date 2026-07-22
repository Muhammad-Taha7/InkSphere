import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = `${(import.meta.env.VITE_API_URL || 'https://ink-sphere-backend-ukrx.vercel.app')}/api/admin`;

// Create axios instance with interceptor for admin token
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Admin Login
export const adminLogin = createAsyncThunk(
  'admin/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Admin login failed'
      );
    }
  }
);

// Fetch Dashboard Stats
export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch dashboard statistics'
      );
    }
  }
);

// Fetch All Users
export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch users'
      );
    }
  }
);

// Fetch User Details (full profile + all blogs)
export const fetchUserDetails = createAsyncThunk(
  'admin/fetchUserDetails',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${userId}/details`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user details'
      );
    }
  }
);

// Toggle User Block
export const toggleUserBlock = createAsyncThunk(
  'admin/toggleUserBlock',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/${userId}/block`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update user block status'
      );
    }
  }
);

// Admin Delete Blog
export const adminDeleteBlog = createAsyncThunk(
  'admin/deleteBlog',
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/blogs/${blogId}`);
      return { ...response.data, blogId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete blog'
      );
    }
  }
);

// Update Admin Credentials
export const updateAdminCredentials = createAsyncThunk(
  'admin/updateCredentials',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.put('/update-credentials', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update credentials'
      );
    }
  }
);

const initialState = {
  adminToken: localStorage.getItem('adminToken') || null,
  adminUser: null,
  stats: null,
  users: [],
  selectedUser: null,
  selectedUserBlogs: [],
  selectedUserStats: null,
  isLoadingStats: false,
  isLoadingUsers: false,
  isLoadingUserDetails: false,
  isTogglingBlock: false,
  isDeletingBlog: false,
  isUpdatingCredentials: false,
  isLoggingIn: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    adminLogout: (state) => {
      localStorage.removeItem('adminToken');
      state.adminToken = null;
      state.adminUser = null;
      state.stats = null;
      state.users = [];
      state.selectedUser = null;
      state.selectedUserBlogs = [];
      state.selectedUserStats = null;
      state.error = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
      state.selectedUserBlogs = [];
      state.selectedUserStats = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin Login
      .addCase(adminLogin.pending, (state) => {
        state.isLoggingIn = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.adminToken = action.payload.token;
        state.adminUser = action.payload.user;
        toast.success('Welcome back, Admin!');
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isLoggingIn = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Fetch Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoadingStats = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoadingStats = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoadingStats = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoadingUsers = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoadingUsers = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoadingUsers = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Fetch User Details
      .addCase(fetchUserDetails.pending, (state) => {
        state.isLoadingUserDetails = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.isLoadingUserDetails = false;
        state.selectedUser = action.payload.user;
        state.selectedUserBlogs = action.payload.blogs;
        state.selectedUserStats = action.payload.stats;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.isLoadingUserDetails = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Toggle User Block
      .addCase(toggleUserBlock.pending, (state) => {
        state.isTogglingBlock = true;
      })
      .addCase(toggleUserBlock.fulfilled, (state, action) => {
        state.isTogglingBlock = false;
        const updatedUser = action.payload.user;
        const userIndex = state.users.findIndex(u => u._id === updatedUser._id);
        if (userIndex !== -1) {
          state.users[userIndex].isBlocked = updatedUser.isBlocked;
        }
        // Also update selectedUser if viewing this user
        if (state.selectedUser && state.selectedUser._id === updatedUser._id) {
          state.selectedUser.isBlocked = updatedUser.isBlocked;
        }
        toast.success(action.payload.message);
      })
      .addCase(toggleUserBlock.rejected, (state, action) => {
        state.isTogglingBlock = false;
        toast.error(action.payload);
      })

      // Admin Delete Blog
      .addCase(adminDeleteBlog.pending, (state) => {
        state.isDeletingBlog = true;
      })
      .addCase(adminDeleteBlog.fulfilled, (state, action) => {
        state.isDeletingBlog = false;
        // Remove blog from selectedUserBlogs
        state.selectedUserBlogs = state.selectedUserBlogs.filter(
          b => b._id !== action.payload.blogId
        );
        // Update stats
        if (state.selectedUserStats) {
          state.selectedUserStats.totalBlogs -= 1;
        }
        toast.success(action.payload.message);
      })
      .addCase(adminDeleteBlog.rejected, (state, action) => {
        state.isDeletingBlog = false;
        toast.error(action.payload);
      })

      // Update Admin Credentials
      .addCase(updateAdminCredentials.pending, (state) => {
        state.isUpdatingCredentials = true;
        state.error = null;
      })
      .addCase(updateAdminCredentials.fulfilled, (state, action) => {
        state.isUpdatingCredentials = false;
        state.adminUser = action.payload.user;
        toast.success(action.payload.message);
      })
      .addCase(updateAdminCredentials.rejected, (state, action) => {
        state.isUpdatingCredentials = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { clearAdminError, adminLogout, clearSelectedUser } = adminSlice.actions;
export default adminSlice.reducer;
