import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  sendMessage,
  addUserMessage,
  clearChat,
  clearError,
  fetchModels,
  selectMessages,
  selectLoading,
  selectError,
  selectSelectedModel,
} from '../redux/chatSlice';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import LoadingSpinner from './LoadingSpinner';
import ErrorBanner from './ErrorBanner';
import ModelSelector from './ModelSelector';
import '../styles/ChatBox.css';

function ChatBox() {
  const dispatch = useDispatch();
  const messages = useSelector(selectMessages);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const selectedModel = useSelector(selectSelectedModel);
  const messagesEndRef = useRef(null);

  // Fetch available models on mount
  useEffect(() => {
    dispatch(fetchModels());
  }, [dispatch]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle sending a message
  const handleSendMessage = (text) => {
    if (!text.trim() || loading) return;

    const trimmedText = text.trim();

    // Add user message to state first
    dispatch(addUserMessage(trimmedText));

    // Inject real-time date, time, and timezone into the system prompt
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const currentTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Build conversation history with system prompt and all messages
    const conversationHistory = [
      {
        role: 'system',
        content:
          `You are a helpful AI assistant with access to real-time information. ` +
          `Current date: ${currentDate}. Current time: ${currentTime}. Timezone: ${timezone}. ` +
          `Answer every question clearly and completely. ` +
          `Use the conversation history to maintain context. Never ask the user to repeat ` +
          `information they have already provided. If the user told you something earlier ` +
          `in the conversation, remember and use that information. ` +
          `For real-time data like weather, news, stock prices, or live events, provide ` +
          `the best available information based on your knowledge.`,
      },
      ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
      { role: 'user', content: trimmedText },
    ];

    // Send full conversation history with the selected model
    dispatch(sendMessage({ conversationHistory, model: selectedModel }));
  };

  // Handle clearing the chat
  const handleClearChat = () => {
    dispatch(clearChat());
  };

  // Handle dismissing error
  const handleDismissError = () => {
    dispatch(clearError());
  };

  return (
    <div className="chatbox">
      {/* Header */}
      <div className="chatbox-header">
        <div className="chatbox-header-info">
          <div className="chatbox-avatar">AI</div>
          <div>
            <h1 className="chatbox-title">ChatBot Assistant</h1>
            <span className="chatbox-status">
              {loading ? 'Typing...' : 'Online'}
            </span>
          </div>
        </div>
        <div className="chatbox-header-actions">
          <ModelSelector />
          <button
            className="clear-btn"
            onClick={handleClearChat}
            title="Clear chat"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <ErrorBanner message={error} onDismiss={handleDismissError} />
      )}

      {/* Messages Area */}
      <div className="chatbox-messages">
        {messages.length === 0 && (
          <div className="empty-chat">
            <div className="empty-chat-icon">💬</div>
            <p>Start a conversation with the AI assistant!</p>
            <p className="empty-chat-hint">Type a message below to get started.</p>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* Loading indicator */}
        {loading && <LoadingSpinner />}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput onSend={handleSendMessage} disabled={loading} />
    </div>
  );
}

export default ChatBox;
