import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'https://ink-sphere-backend-ukrx.vercel.app/api/notifications';

const authAxios = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    headers: { Authorization: token ? `Bearer ${token}` : '' }
  });
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await authAxios().get(API_URL);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markRead',
  async (id, thunkAPI) => {
    try {
      const response = await authAxios().put(`${API_URL}/${id}/read`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to mark read');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllRead',
  async (_, thunkAPI) => {
    try {
      await authAxios().put(`${API_URL}/read-all`);
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to mark all read');
    }
  }
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    receiveNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
      const username = action.payload.sender?.username || action.payload.sender?.name || 'a user';
      const msg = action.payload.type === 'like'
        ? `You have a like from ${username}`
        : `You have got a comment from the user ${username}`;
      toast.success(msg);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n._id === action.payload._id);
        if (index > -1 && !state.notifications[index].isRead) {
          state.notifications[index].isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(n => n.isRead = true);
        state.unreadCount = 0;
      });
  }
});

export const { receiveNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
