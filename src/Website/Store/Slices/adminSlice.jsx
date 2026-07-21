import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api/admin';

// Create axios instance with interceptor for auth token
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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

const initialState = {
  stats: null,
  users: [],
  isLoadingStats: false,
  isLoadingUsers: false,
  isTogglingBlock: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
        toast.success(action.payload.message);
      })
      .addCase(toggleUserBlock.rejected, (state, action) => {
        state.isTogglingBlock = false;
        toast.error(action.payload);
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
