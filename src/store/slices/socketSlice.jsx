import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  socket: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket: (state, action) => {
      // We store the non-serializable socket instance here 
      // Need to configure Redux middleware to ignore serializable checks for this path
      state.socket = action.payload;
    },
    removeSocket: (state) => {
      if (state.socket) {
        state.socket.close();
      }
      state.socket = null;
    }
  },
});

export const { setSocket, removeSocket } = socketSlice.actions;
export default socketSlice.reducer;
