import React from 'react';
import '../styles/ErrorBanner.css';

function ErrorBanner({ message, onDismiss }) {
  return (
    <div className="error-banner" role="alert">
      <span className="error-icon">⚠️</span>
      <span className="error-text">{message}</span>
      <button className="error-dismiss" onClick={onDismiss} title="Dismiss error">
        ✕
      </button>
    </div>
  );
}

export default ErrorBanner;
