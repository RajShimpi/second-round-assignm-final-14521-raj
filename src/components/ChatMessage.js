import React from 'react';
import '../styles/ChatMessage.css';

function ChatMessage({ message }) {
  const { role, content, timestamp } = message;
  const isUser = role === 'user';

  // Format the timestamp for display
  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`message-row ${isUser ? 'message-user' : 'message-assistant'}`}>
      <div className="message-avatar">
        {isUser ? '👤' : '🤖'}
      </div>
      <div className={`message-bubble ${isUser ? 'bubble-user' : 'bubble-assistant'}`}>
        <p className="message-text">{content}</p>
        <span className="message-time">{formattedTime}</span>
      </div>
    </div>
  );
}

export default React.memo(ChatMessage);
