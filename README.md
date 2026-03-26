# Chatbox Application with OpenAI API Integration Using Redux

A real-time chatbox application built with React and Redux Toolkit that integrates with OpenAI's ChatGPT API. Users can send messages, select AI models, and receive responses in a responsive chat interface.

## Features

- Real-time chat with OpenAI ChatGPT API
- Dynamic model selection (fetches available GPT models from OpenAI)
- Full conversation history maintained across messages
- Redux Toolkit for state management with async thunks
- Loading indicators while awaiting AI responses
- Error handling with dismissible error banners
- Responsive design for mobile, tablet, and desktop
- Auto-scrolling to latest messages
- Keyboard support (Enter to send, Shift+Enter for new line)

## Tech Stack

- **React** 19.2.4
- **Redux Toolkit** 2.11.2 (with async thunks for API calls)
- **React-Redux** 9.2.0
- **Axios** 1.13.6
- **React Scripts** 5.0.1

## Prerequisites

- Node.js (v16 or higher)
- npm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Setup and Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/exelynt-learning-platform/second-round-assignm-final-14521-raj.git
   cd second-round-assignm-final-14521-raj
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your OpenAI API key:

   ```
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:

   ```bash
   npm start
   ```

   The app will open at [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command         | Description                        |
|-----------------|------------------------------------|
| `npm start`     | Runs the app in development mode   |
| `npm test`      | Runs the test suite                |
| `npm run build` | Builds the app for production      |

## Running Tests

```bash
npm test
```

Tests cover:

- **Redux chatSlice** - Reducer actions, async thunk pending/fulfilled/rejected states, model fetching, error handling
- **ChatBox component** - Header rendering, empty state, input/send button, model selector, message display, error banner, loading state, clear chat functionality

## Project Structure

```
src/
├── components/
│   ├── ChatBox.js            # Main chat container component
│   ├── ChatBox.test.js       # ChatBox component tests
│   ├── ChatInput.js          # Message input with send button
│   ├── ChatMessage.js        # Individual message bubble
│   ├── ErrorBanner.js        # Dismissible error notification
│   ├── LoadingSpinner.js     # Typing indicator (bouncing dots)
│   └── ModelSelector.js      # AI model selection dropdown
├── redux/
│   ├── store.js              # Redux store configuration
│   ├── chatSlice.js          # Redux slice with async thunks
│   └── chatSlice.test.js     # Redux slice tests
├── styles/
│   ├── index.css             # Global styles
│   ├── App.css               # App container styles
│   ├── ChatBox.css           # ChatBox layout and header
│   ├── ChatMessage.css       # Message bubble styles
│   ├── ChatInput.css         # Input form styles
│   ├── LoadingSpinner.css    # Loading animation
│   ├── ErrorBanner.css       # Error banner styles
│   └── ModelSelector.css     # Model dropdown styles
├── App.js                    # Root component
└── index.js                  # Entry point
```

## State Management

The application uses Redux Toolkit with a single `chatSlice` managing:

| State Field     | Description                              |
|-----------------|------------------------------------------|
| `messages`      | Array of user and assistant messages      |
| `loading`       | Boolean for API call in progress          |
| `error`         | Error message string or null              |
| `models`        | Array of available GPT model IDs          |
| `modelsLoading` | Boolean for model fetch in progress       |
| `modelsError`   | Error message for model fetch failure     |
| `selectedModel` | Currently selected model (default: gpt-4o)|

Async operations are handled via `createAsyncThunk`:

- `fetchModels` - Fetches available GPT models from OpenAI API
- `sendMessage` - Sends conversation history and receives AI response

## API Integration

The app communicates with two OpenAI endpoints:

- `GET https://api.openai.com/v1/models` - Fetch available models
- `POST https://api.openai.com/v1/chat/completions` - Send messages and receive responses

The API key is securely managed via the `REACT_APP_OPENAI_API_KEY` environment variable and is never committed to version control.

## Responsive Design

- Mobile-first CSS approach with breakpoints at 480px and 768px
- Uses `dvh` units with `vh` fallback for mobile browser compatibility
- Touch-friendly button sizes (40-44px)
- 16px font size on mobile inputs to prevent iOS auto-zoom
- Flexible message bubbles with word-break handling
