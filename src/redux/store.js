import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice';

// Configure the Redux store with the chat reducer
export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
});
