import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch available models from OpenAI API
export const fetchModels = createAsyncThunk(
  'chat/fetchModels',
  async (_, { rejectWithValue }) => {
    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

      if (!apiKey || apiKey === 'your_openai_api_key_here') {
        throw new Error('Please set your OpenAI API key in the .env file');
      }

      const response = await axios.get('https://api.openai.com/v1/models', {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      // Filter to only chat-compatible models (gpt variants)
      const chatModels = response.data.data
        .filter((model) => model.id.includes('gpt'))
        .map((model) => model.id)
        .sort();

      return chatModels;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          error.response.data?.error?.message || 'Failed to fetch models.'
        );
      }
      return rejectWithValue(error.message || 'Failed to fetch models.');
    }
  }
);

// Async thunk to send a message to OpenAI ChatGPT API
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ conversationHistory, model }, { rejectWithValue }) => {
    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

      if (!apiKey || apiKey === 'your_openai_api_key_here') {
        throw new Error('Please set your OpenAI API key in the .env file');
      }

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: model,
          messages: conversationHistory,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      // Extract the AI response
      const choice = response.data.choices[0];
      const aiMessage = choice.message.content;
      return aiMessage;
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          return rejectWithValue('Invalid API key. Please check your OpenAI API key.');
        } else if (status === 429) {
          return rejectWithValue('Rate limit exceeded. Please try again later.');
        } else if (status === 500) {
          return rejectWithValue('OpenAI server error. Please try again later.');
        }
        return rejectWithValue(
          error.response.data?.error?.message || 'API request failed.'
        );
      } else if (error.request) {
        return rejectWithValue('Network error. Please check your internet connection.');
      }
      return rejectWithValue(error.message || 'An unexpected error occurred.');
    }
  }
);

const initialState = {
  messages: [],
  loading: false,
  error: null,
  models: [],
  modelsLoading: false,
  modelsError: null,
  selectedModel: 'gpt-4o',
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({
        id: Date.now(),
        role: 'user',
        content: action.payload,
        timestamp: new Date().toISOString(),
      });
      state.error = null;
    },
    clearChat: (state) => {
      state.messages = [];
      state.error = null;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSelectedModel: (state, action) => {
      state.selectedModel = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchModels
      .addCase(fetchModels.pending, (state) => {
        state.modelsLoading = true;
        state.modelsError = null;
      })
      .addCase(fetchModels.fulfilled, (state, action) => {
        state.modelsLoading = false;
        state.models = action.payload;
      })
      .addCase(fetchModels.rejected, (state, action) => {
        state.modelsLoading = false;
        state.modelsError = action.payload || 'Failed to fetch models.';
      })
      // sendMessage
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          id: Date.now() + 1,
          role: 'assistant',
          content: action.payload,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to get response from AI.';
      });
  },
});

export const { addUserMessage, clearChat, clearError, setSelectedModel } =
  chatSlice.actions;

// Selectors
export const selectMessages = (state) => state.chat.messages;
export const selectLoading = (state) => state.chat.loading;
export const selectError = (state) => state.chat.error;
export const selectModels = (state) => state.chat.models;
export const selectModelsLoading = (state) => state.chat.modelsLoading;
export const selectModelsError = (state) => state.chat.modelsError;
export const selectSelectedModel = (state) => state.chat.selectedModel;

export default chatSlice.reducer;
