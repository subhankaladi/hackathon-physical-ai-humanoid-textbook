import { useState } from 'react';
import axios from 'axios';
import './chat.css';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { sender: "user", text: input };
    const currentInput = input;
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    
    try {
      console.log("Sending message:", currentInput);
      
      const res = await axios.post("https://subhankaladi-deploy-youtube.hf.space/chat", {
        message: currentInput
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Response received:", res);
      console.log("Response data:", res.data);
      
      const botReply = res.data.reply || res.data.response || res.data.message || "No response from server";
      const botMessage = { sender: "bot", text: botReply };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat error details:", err);
      console.error("Error response:", err.response);
      
      const errorMsg = err.response?.data?.error || err.message || "Unable to reach server";
      setMessages(prev => [...prev, { 
        sender: "bot", 
        text: `Error: ${errorMsg}` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <button className="chat-button" onClick={() => setOpen(!open)}>
        💬 Chat
      </button>
      {open && (
        <div className="chat-box">
          <div className="chat-header">
            <strong>AI Assistant</strong>
          </div>
          <div className="chat-body">
            {messages.map((m, i) => (
              <div key={i} className={`bubble ${m.sender}`}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="bubble bot">
                <em>Typing...</em>
              </div>
            )}
          </div>
          <div className="chat-input">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type message..."
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading}>
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
