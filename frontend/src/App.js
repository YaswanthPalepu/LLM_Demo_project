import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const inputRef = useRef(null); // Ref for input
  const messagesEndRef = useRef(null);
  const backendUrl = 'http://127.0.0.1:8000';

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on page load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userQuestion = question;
    setMessages(prev => [...prev, { type: 'user', text: userQuestion, timestamp: new Date() }]);
    setQuestion('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${backendUrl}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userQuestion }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Something went wrong on the server.');
      }

      const data = await res.json();
      setMessages(prev => [...prev, { type: 'assistant', text: data.result, timestamp: new Date() }]);
      console.log("Full response:", data);
    } catch (err) {
      setError(err.message);
      setMessages(prev => [...prev, { type: 'assistant', text: `Error: ${err.message}`, timestamp: new Date(), isError: true }]);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      inputRef.current?.focus(); // Keep input focused after sending
    }
  };

  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="App">
      <header className="App-header">
        <h1>Helpdesk Chatbot</h1>
      </header>
      <main className="chat-container">
        <div className="messages-display">
          {messages.length === 0 && !loading && (
            <div className="welcome-message">Hello! How can I assist you today?</div>
          )}
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.type} ${msg.isError ? 'error' : ''}`}>
              <div className="message-avatar">{msg.type === 'user' ? '🧑' : '🤖'}</div>
              <div className="message-content">
                <div className="message-bubble">{msg.text}</div>
                <span className="message-timestamp">{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat-message assistant loading">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="message-bubble">Thinking...</div>
              </div>
            </div>
          )}
          {error && messages.every(msg => !msg.isError) && (
            <div className="chat-message assistant error">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="message-bubble">A general error occurred: {error}</div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="query-form">
          <input
            type="text"
            ref={inputRef} // attach ref here
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={loading ? "Waiting for response..." : "Type your message..."}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !question.trim()}>Send</button>
        </form>
      </main>
    </div>
  );
}

export default App;
