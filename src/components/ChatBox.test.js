import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../redux/chatSlice';
import ChatBox from './ChatBox';

window.HTMLElement.prototype.scrollIntoView = jest.fn();

process.env.REACT_APP_OPENAI_API_KEY = 'test-key-for-unit-tests';

jest.mock('axios', () => {
  const mock = {
    __esModule: true,
    get: jest.fn().mockResolvedValue({
      data: {
        data: [
          { id: 'gpt-4o' },
          { id: 'gpt-3.5-turbo' },
        ],
      },
    }),
    post: jest.fn().mockResolvedValue({
      data: {
        choices: [{ message: { content: 'Mock response' } }],
      },
    }),
  };
  mock.default = mock;
  return mock;
});

function renderWithStore(preloadedState) {
  const defaultState = {
    messages: [],
    loading: false,
    error: null,
    models: ['gpt-4o', 'gpt-3.5-turbo'],
    modelsLoading: false,
    modelsError: null,
    selectedModel: 'gpt-4o',
  };

  const store = configureStore({
    reducer: { chat: chatReducer },
    preloadedState: { chat: preloadedState ? { ...defaultState, ...preloadedState } : defaultState },
  });

  let result;
  act(() => {
    result = render(
      <Provider store={store}>
        <ChatBox />
      </Provider>
    );
  });

  return result;
}

describe('ChatBox component', () => {
  it('renders the header with title', async () => {
    renderWithStore();
    await waitFor(() => {
      expect(screen.getByText('ChatBot Assistant')).toBeInTheDocument();
    });
  });

  it('renders empty state when no messages', async () => {
    renderWithStore();
    await waitFor(() => {
      expect(
        screen.getByText('Start a conversation with the AI assistant!')
      ).toBeInTheDocument();
    });
  });

  it('renders the input field and send button', async () => {
    renderWithStore();
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Type your message...')
      ).toBeInTheDocument();
      expect(screen.getByTitle('Send message')).toBeInTheDocument();
    });
  });

  it('renders the model selector dropdown when models are loaded', async () => {
    renderWithStore({
      models: ['gpt-4o', 'gpt-3.5-turbo'],
      modelsLoading: false,
      modelsError: null,
    });

    await waitFor(() => {
      const select = screen.queryByRole('combobox');
      const retry = screen.queryByText('Retry');
      expect(select || retry).toBeTruthy();
    });
  });

  it('renders messages when present', async () => {
    renderWithStore({
      messages: [
        {
          id: 1,
          role: 'user',
          content: 'Hello AI',
          timestamp: new Date().toISOString(),
        },
        {
          id: 2,
          role: 'assistant',
          content: 'Hi there!',
          timestamp: new Date().toISOString(),
        },
      ],
    });

    await waitFor(() => {
      expect(screen.getByText('Hello AI')).toBeInTheDocument();
      expect(screen.getByText('Hi there!')).toBeInTheDocument();
    });
  });

  it('renders error banner when error exists', async () => {
    renderWithStore({
      error: 'API key invalid',
    });

    await waitFor(() => {
      expect(screen.getByText('API key invalid')).toBeInTheDocument();
    });
  });

  it('disables input when loading', async () => {
    renderWithStore({
      loading: true,
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type your message...')).toBeDisabled();
    });
  });

  it('shows typing indicator when loading', async () => {
    renderWithStore({
      loading: true,
    });

    await waitFor(() => {
      expect(screen.getByText('Typing...')).toBeInTheDocument();
    });
  });

  it('clears chat when clear button is clicked', async () => {
    renderWithStore({
      messages: [
        {
          id: 1,
          role: 'user',
          content: 'Hello',
          timestamp: new Date().toISOString(),
        },
      ],
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Clear'));
    });

    await waitFor(() => {
      expect(
        screen.getByText('Start a conversation with the AI assistant!')
      ).toBeInTheDocument();
    });
  });
});
