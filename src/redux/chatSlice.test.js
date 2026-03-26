import chatReducer, {
  addUserMessage,
  clearChat,
  clearError,
  setSelectedModel,
  sendMessage,
  fetchModels,
} from './chatSlice';

describe('chatSlice reducer', () => {
  const initialState = {
    messages: [],
    loading: false,
    error: null,
    models: [],
    modelsLoading: false,
    modelsError: null,
    selectedModel: 'gpt-4o',
  };

  it('should return the initial state', () => {
    expect(chatReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addUserMessage', () => {
    const state = chatReducer(initialState, addUserMessage('Hello'));
    expect(state.messages).toHaveLength(1);
    expect(state.messages[0].role).toBe('user');
    expect(state.messages[0].content).toBe('Hello');
    expect(state.messages[0]).toHaveProperty('id');
    expect(state.messages[0]).toHaveProperty('timestamp');
  });

  it('should clear error when addUserMessage is dispatched', () => {
    const stateWithError = { ...initialState, error: 'Some error' };
    const state = chatReducer(stateWithError, addUserMessage('Hello'));
    expect(state.error).toBeNull();
  });

  it('should handle clearChat', () => {
    const stateWithMessages = {
      ...initialState,
      messages: [
        { id: 1, role: 'user', content: 'Hi', timestamp: '2024-01-01' },
      ],
      loading: true,
      error: 'Some error',
    };
    const state = chatReducer(stateWithMessages, clearChat());
    expect(state.messages).toHaveLength(0);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    const stateWithError = { ...initialState, error: 'API Error' };
    const state = chatReducer(stateWithError, clearError());
    expect(state.error).toBeNull();
  });

  it('should handle setSelectedModel', () => {
    const state = chatReducer(initialState, setSelectedModel('gpt-3.5-turbo'));
    expect(state.selectedModel).toBe('gpt-3.5-turbo');
  });

  // Test sendMessage async thunk states
  it('should set loading true on sendMessage.pending', () => {
    const state = chatReducer(initialState, {
      type: sendMessage.pending.type,
    });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should add assistant message on sendMessage.fulfilled', () => {
    const loadingState = { ...initialState, loading: true };
    const state = chatReducer(loadingState, {
      type: sendMessage.fulfilled.type,
      payload: 'Hello! How can I help?',
    });
    expect(state.loading).toBe(false);
    expect(state.messages).toHaveLength(1);
    expect(state.messages[0].role).toBe('assistant');
    expect(state.messages[0].content).toBe('Hello! How can I help?');
  });

  it('should set error on sendMessage.rejected', () => {
    const loadingState = { ...initialState, loading: true };
    const state = chatReducer(loadingState, {
      type: sendMessage.rejected.type,
      payload: 'Network error',
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network error');
  });

  it('should set default error message on sendMessage.rejected without payload', () => {
    const loadingState = { ...initialState, loading: true };
    const state = chatReducer(loadingState, {
      type: sendMessage.rejected.type,
    });
    expect(state.error).toBe('Failed to get response from AI.');
  });

  // Test fetchModels async thunk states
  it('should set modelsLoading true on fetchModels.pending', () => {
    const state = chatReducer(initialState, {
      type: fetchModels.pending.type,
    });
    expect(state.modelsLoading).toBe(true);
    expect(state.modelsError).toBeNull();
  });

  it('should set models on fetchModels.fulfilled', () => {
    const state = chatReducer(initialState, {
      type: fetchModels.fulfilled.type,
      payload: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4o'],
    });
    expect(state.modelsLoading).toBe(false);
    expect(state.models).toEqual(['gpt-3.5-turbo', 'gpt-4', 'gpt-4o']);
  });

  it('should set modelsError on fetchModels.rejected', () => {
    const state = chatReducer(initialState, {
      type: fetchModels.rejected.type,
      payload: 'Failed to fetch models.',
    });
    expect(state.modelsLoading).toBe(false);
    expect(state.modelsError).toBe('Failed to fetch models.');
  });
});
