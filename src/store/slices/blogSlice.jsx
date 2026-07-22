import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${(import.meta.env.VITE_API_URL || 'https://ink-sphere-backend-ukrx.vercel.app')}/api/blogs`;

// Axios with auth header
const authAxios = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    headers: { Authorization: token ? `Bearer ${token}` : '' }
  });
};

// Get all published blogs (public)
export const fetchBlogs = createAsyncThunk('blogs/fetchAll', async (params = {}, thunkAPI) => {
  try {
    const { page = 1, limit = 12, search = '', tag = '' } = params;
    const response = await axios.get(API_URL, {
      params: { page, limit, search, tag }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch blogs');
  }
});

// Get single blog
export const fetchBlog = createAsyncThunk('blogs/fetchOne', async (id, thunkAPI) => {
  try {
    const token = localStorage.getItem('token');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await axios.get(`${API_URL}/${id}`, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch blog');
  }
});

// Get my blogs
export const fetchMyBlogs = createAsyncThunk('blogs/fetchMine', async (_, thunkAPI) => {
  try {
    const response = await authAxios().get(`${API_URL}/my-blogs`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch your blogs');
  }
});

// Create blog
export const createBlog = createAsyncThunk('blogs/create', async (formData, thunkAPI) => {
  try {
    const response = await authAxios().post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create blog');
  }
});

// Update blog
export const updateBlog = createAsyncThunk('blogs/update', async ({ id, formData }, thunkAPI) => {
  try {
    const response = await authAxios().put(`${API_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update blog');
  }
});

// Delete blog
export const deleteBlog = createAsyncThunk('blogs/delete', async (id, thunkAPI) => {
  try {
    await authAxios().delete(`${API_URL}/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete blog');
  }
});

// Toggle like
export const toggleLike = createAsyncThunk('blogs/toggleLike', async (id, thunkAPI) => {
  try {
    const response = await authAxios().post(`${API_URL}/${id}/like`);
    return { id, ...response.data };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to toggle like');
  }
});

// Add comment
export const addComment = createAsyncThunk('blogs/addComment', async ({ id, content }, thunkAPI) => {
  try {
    const response = await authAxios().post(`${API_URL}/${id}/comment`, { content });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add comment');
  }
});

const initialState = {
  blogs: [],
  myBlogs: [],
  currentBlog: null,
  isLoading: false,
  error: null,
  pagination: null,
  successMessage: null,
};

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    clearBlogError: (state) => {
      state.error = null;
    },
    clearBlogSuccess: (state) => {
      state.successMessage = null;
    },
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
    receiveComment: (state, action) => {
      const { blogId, comment, commentsCount } = action.payload;
      if (state.currentBlog && state.currentBlog._id === blogId) {
        // Prevent duplicate comments if we already added it via our own request
        const exists = state.currentBlog.comments.find(c => c._id === comment._id);
        if (!exists) {
          state.currentBlog.comments.unshift(comment);
        }
        state.currentBlog.commentsCount = commentsCount;
      }
    },
    receiveLikeUpdate: (state, action) => {
      const { blogId, likesCount } = action.payload;
      if (state.currentBlog && state.currentBlog._id === blogId) {
        state.currentBlog.likesCount = likesCount;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all blogs
      .addCase(fetchBlogs.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload.blogs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch single blog
      .addCase(fetchBlog.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBlog = action.payload.blog;
      })
      .addCase(fetchBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch my blogs
      .addCase(fetchMyBlogs.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchMyBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myBlogs = action.payload.blogs;
      })
      .addCase(fetchMyBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create blog
      .addCase(createBlog.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myBlogs.unshift(action.payload.blog);
        state.successMessage = 'Blog created successfully!';
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update blog
      .addCase(updateBlog.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.myBlogs.findIndex(b => b._id === action.payload.blog._id);
        if (index > -1) state.myBlogs[index] = action.payload.blog;
        state.successMessage = 'Blog updated successfully!';
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete blog
      .addCase(deleteBlog.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myBlogs = state.myBlogs.filter(b => b._id !== action.payload);
        state.successMessage = 'Blog deleted successfully!';
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Toggle like
      .addCase(toggleLike.fulfilled, (state, action) => {
        if (state.currentBlog && state.currentBlog._id === action.payload.id) {
          state.currentBlog.hasLiked = action.payload.hasLiked;
          state.currentBlog.likesCount = action.payload.likesCount;
        }
      })

      // Add comment
      .addCase(addComment.fulfilled, (state, action) => {
        if (state.currentBlog) {
          state.currentBlog.comments.unshift(action.payload.comment);
          state.currentBlog.commentsCount = (state.currentBlog.commentsCount || 0) + 1;
        }
      });
  },
});

export const { clearBlogError, clearBlogSuccess, clearCurrentBlog, receiveComment, receiveLikeUpdate } = blogSlice.actions;
export default blogSlice.reducer;
