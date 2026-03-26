import React from 'react';
import '../styles/LoadingSpinner.css';

function LoadingSpinner() {
  return (
    <div className="message-row message-assistant">
      <div className="message-avatar">🤖</div>
      <div className="loading-bubble">
        <div className="typing-indicator">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
