import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

// Axios instance with auth header
const authAxios = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    headers: { Authorization: token ? `Bearer ${token}` : '' }
  });
};

// Register user (triggers OTP flow)
export const registerUser = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

// Verify OTP
export const verifyOTP = createAsyncThunk('auth/verifyOTP', async ({ email, otp }, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'OTP verification failed');
  }
});

// Resend OTP
export const resendOTP = createAsyncThunk('auth/resendOTP', async (email, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/resend-otp`, { email });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to resend OTP');
  }
});

// Login user
export const loginUser = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    const data = error.response?.data;
    if (data?.needsVerification) {
      return thunkAPI.rejectWithValue({ message: data.message, needsVerification: true, email: data.email });
    }
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

// Get current user from token
export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
  try {
    const response = await authAxios().get(`${API_URL}/me`);
    return response.data;
  } catch (error) {
    localStorage.removeItem('token');
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Session expired');
  }
});

// Complete profile
export const completeProfile = createAsyncThunk('auth/completeProfile', async (formData, thunkAPI) => {
  try {
    const response = await authAxios().put(`${import.meta.env.VITE_API_URL}/api/users/complete-profile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to complete profile');
  }
});

// Update profile
export const updateProfile = createAsyncThunk('auth/updateProfile', async (formData, thunkAPI) => {
  try {
    const response = await authAxios().put(`${import.meta.env.VITE_API_URL}/api/users/profile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update profile');
  }
});

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,
  otpSent: false,
  otpEmail: null,
  needsVerification: false,
  successMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.otpSent = false;
      state.otpEmail = null;
      state.needsVerification = false;
      state.error = null;
      state.successMessage = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    resetAuthFlow: (state) => {
      state.otpSent = false;
      state.otpEmail = null;
      state.needsVerification = false;
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpSent = true;
        state.otpEmail = action.payload.email;
        state.successMessage = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Verify OTP
      .addCase(verifyOTP.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.otpSent = false;
        state.needsVerification = false;
        state.successMessage = 'Email verified successfully!';
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Resend OTP
      .addCase(resendOTP.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(resendOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        if (typeof action.payload === 'object' && action.payload?.needsVerification) {
          state.needsVerification = true;
          state.otpSent = true;
          state.otpEmail = action.payload.email;
          state.error = action.payload.message;
        } else {
          state.error = action.payload;
        }
      })

      // Get Me
      .addCase(getMe.pending, (state) => { state.isLoading = true; })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(getMe.rejected, (state) => {
        state.isLoading = false;
        state.token = null;
        state.user = null;
      })

      // Complete Profile
      .addCase(completeProfile.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(completeProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.successMessage = 'Profile completed!';
      })
      .addCase(completeProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.successMessage = 'Profile updated!';
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, clearSuccess, setToken, resetAuthFlow } = authSlice.actions;
export default authSlice.reducer;