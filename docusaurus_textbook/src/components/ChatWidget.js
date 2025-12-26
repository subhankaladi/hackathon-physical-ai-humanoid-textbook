import { useState } from "react";
import axios from "axios";
import "./chat.css";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { sender: "user", text: input };
    const currentInput = input;

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://subhankaladi-deploy-youtube.hf.space/ask",
        {
          query: currentInput   // ✅ FIXED: backend expects "query"
        },
        {
          headers: {
            "Content-Type": "application/json"
          },
          timeout: 15000        // ✅ RAG-safe timeout
        }
      );

      const botReply = res.data?.answer || "No answer returned";

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: botReply }
      ]);

    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.message ||
        "Server not reachable";

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `Error: ${errorMsg}` }
      ]);

    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
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
                <em>Thinking...</em>
              </div>
            )}
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your question..."
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
