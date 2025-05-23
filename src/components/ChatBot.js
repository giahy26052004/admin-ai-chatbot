import React, { useState, useRef, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const isSendingRef = useRef(false);
  const scrollRef = useRef(null);

  const toggleChat = () => setIsOpen((prev) => !prev);

  const onSendMessage = async () => {
    if (text.trim() === "" || isSendingRef.current) return;

    const userMessage = { name: "user", message: text };
    setMessages((prev) => [...prev, userMessage]);
    setText("");
    isSendingRef.current = true;

    try {
      const res = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: text }),
      });

      const data = await res.json();
      setSessionId(data.sessionId);

      const botMessage = { name: "bot", message: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        { name: "bot", message: "Có lỗi xảy ra, vui lòng thử lại sau!" },
      ]);
    } finally {
      isSendingRef.current = false;
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Nếu bạn muốn render message có thể chứa HTML hoặc có style phức tạp,
  // bạn có thể sử dụng dangerouslySetInnerHTML như dưới (cẩn thận với XSS)
  // hoặc parse content, ở đây để demo mình giữ dạng text thuần.

  return (
    <>
      <style>
        {`
       .chat-container {
  position: fixed !important;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  width: 384px;
  max-width: 100vw;  /* không vượt quá màn hình */
  box-sizing: border-box;
}

          .chat-box {
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            width: 384px;
            height: 500px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .chat-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            color: white;
            background: linear-gradient(to right, #6b21a8, #a855f7);
            font-weight: bold;
            font-size: 18px;
          }

          .chat-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            background: #f9fafb;
            scrollbar-width: thin;
            scrollbar-color: #a855f7 #f9fafb;
          }

          .chat-messages::-webkit-scrollbar {
            width: 8px;
          }

          .chat-messages::-webkit-scrollbar-track {
            background: #f9fafb;
            border-radius: 4px;
          }

          .chat-messages::-webkit-scrollbar-thumb {
            background-color: #a855f7;
            border-radius: 4px;
          }

          .chat-message {
            margin: 8px 0;
            padding: 10px 18px;
            border-radius: 20px;
            max-width: 75%;
            word-break: break-word;
            white-space: pre-line; /* giữ xuống dòng nếu có */
            font-size: 14px;
            line-height: 1.4;
            box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
          }

          .chat-message.user {
            margin-left: auto;
            background: linear-gradient(to right, #6b21a8, #a855f7);
            color: white;
            border-bottom-right-radius: 4px;
          }

          .chat-message.bot {
            margin-right: auto;
            background: #e5e7eb;
            color: #1f2937;
            border-bottom-left-radius: 4px;
          }

          .chat-footer {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            border-top: 1px solid #ddd;
            gap: 8px;
            background: #fff;
          }

          .chat-input {
            flex: 1;
            padding: 10px 14px;
            border-radius: 9999px;
            border: 1px solid #ccc;
            outline: none;
            font-size: 14px;
            transition: border-color 0.2s ease;
          }

          .chat-input:focus {
            border-color: #9333ea;
            box-shadow: 0 0 5px #9333ea;
          }

          .send-button {
            padding: 10px 16px;
            color: white;
            background: #9333ea;
            border-radius: 9999px;
            border: none;
            cursor: pointer;
            font-weight: bold;
            font-size: 16px;
            transition: background 0.3s ease;
          }

          .send-button:hover {
            background: #7e22ce;
          }

          .toggle-button {
            width: 48px;
            height: 48px;
            font-size: 24px;
            background: linear-gradient(to right, #6b21a8, #a855f7);
            color: white;
            border: none;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            cursor: pointer;
            user-select: none;
            transition: background 0.3s ease;
          }

          .toggle-button:hover {
            background: linear-gradient(to right, #7e22ce, #c084fc);
          }
        `}
      </style>

      <div className="chat-container">
        {isOpen && (
          <div
            className="chat-box"
            role="region"
            aria-label="Chat bot support window"
          >
            {/* Header */}
            <div className="chat-header">
              <span>Chat Support</span>
              <button
                onClick={toggleChat}
                aria-label="Đóng chat"
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                <FaTimes />
              </button>
            </div>

            {/* Messages */}
            <div className="chat-messages" ref={scrollRef} tabIndex={0}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`chat-message ${
                    msg.name === "user" ? "user" : "bot"
                  }`}
                >
                  {/* Nếu cần render HTML an toàn bạn có thể xử lý ở đây */}
                  {msg.message}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="chat-footer">
              <input
                type="text"
                className="chat-input"
                placeholder="Nhập tin nhắn..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
                aria-label="Nhập tin nhắn"
              />
              <button
                className="send-button"
                onClick={onSendMessage}
                aria-label="Gửi tin nhắn"
                disabled={isSendingRef.current}
              >
                ➤
              </button>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={toggleChat}
          className="toggle-button"
          aria-label={isOpen ? "Đóng chat" : "Mở chat"}
        >
          💬
        </button>
      </div>
    </>
  );
}
