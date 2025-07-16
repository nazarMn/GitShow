import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import EmojiPicker from "./EmojiPicker";
import { saveMessages, loadMessages } from "./indexedDB.js";
import "./ChatPage.css";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

const socket = io("http://localhost:3000");

export default function ChatPage() {
  const { chatId } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chatUser, setChatUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Завантажуємо дані про співрозмовника і поточного користувача
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const currentRes = await fetch("/api/current-user");
        const currentData = await currentRes.json();
        setCurrentUserId(String(currentData.id || currentData._id));

        const [id1, id2] = chatId.split("-");
        const otherUserId = id1 === currentData.id ? id2 : id1;
        const userRes = await fetch(`/api/user/${otherUserId}`);
        const userData = await userRes.json();
        setChatUser(userData);
      } catch (error) {
        console.error("Error fetching chat user:", error);
      }
    };
    fetchUsers();
  }, [chatId]);

  // Завантажуємо історію повідомлень з API і кешуємо
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/${chatId}`);
        const data = await res.json();
        setMessages(data);
        saveMessages(chatId, data);
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };
    fetchMessages();
  }, [chatId]);

  // Завантажуємо повідомлення з IndexedDB для офлайн
  useEffect(() => {
    const load = async () => {
      const msgs = await loadMessages(chatId);
      if (msgs && msgs.length) setMessages(msgs);
    };
    load();
  }, [chatId]);

  // Підписка на отримання повідомлень через сокети
  useEffect(() => {
    socket.emit("joinRoom", chatId);

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => {
        const updated = [...prev, message];
        saveMessages(chatId, updated);
        return updated;
      });
    });

    return () => {
      socket.off("receiveMessage");
      socket.emit("leaveRoom", chatId);
    };
  }, [chatId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageObj = {
      chatId,
      text: newMessage,
    };

    try {
      // Надсилаємо через API, щоб сервер зберіг
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageObj),
      });
      const savedMessage = await res.json();

      // Додаємо локально
      setMessages((prev) => {
        const updated = [...prev, savedMessage];
        saveMessages(chatId, updated);
        return updated;
      });

      // Відправляємо через Socket.IO іншим в кімнаті
      socket.emit("sendMessage", {
        chatId,
        message: savedMessage,
      });

      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prev) => prev + emoji.native);
  };

  const renderMessageContent = (text) => {
    const regex = /```(\w+)?[\s\n]?([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const [fullMatch, langHint, code] = match;
      const start = match.index;

      if (start > lastIndex) {
        parts.push(<p key={lastIndex}>{text.slice(lastIndex, start)}</p>);
      }

      const lang = langHint || hljs.highlightAuto(code).language || "text";

      parts.push(
        <div className="code-block" key={start} style={{ position: "relative" }}>
          <div style={{ fontSize: "12px", color: "#aaa", marginBottom: "4px" }}>
            <strong>Language:</strong> {lang}
          </div>
          <SyntaxHighlighter language={lang} style={oneDark}>
            {code}
          </SyntaxHighlighter>
          <button
            className="copy-button"
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              fontSize: "12px",
              padding: "2px 6px",
              borderRadius: "5px",
              background: "#444",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => navigator.clipboard.writeText(code)}
          >
            Copy
          </button>
        </div>
      );

      lastIndex = start + fullMatch.length;
    }

    if (lastIndex < text.length) {
      parts.push(<p key="last">{text.slice(lastIndex)}</p>);
    }

    return parts;
  };

  return (
    <div className="chat-container dark" style={{ position: "relative" }}>
      <header className="chat-header">
        <button className="back-button" onClick={() => navigate(-1)} title="Назад">
          ⬅
        </button>
        <img src={chatUser?.avatarUrl || "/img/account.png"} alt="Avatar" className="chat-avatar" />
        <h2 className="chat-title">Chat with {chatUser?.username || "User"}</h2>
      </header>

      <div className="chat-messages" ref={messagesContainerRef}>
        {messages.map((msg) => {
          const senderId = typeof msg.sender === "string" ? msg.sender : msg.sender?._id;
          const isMine = senderId === currentUserId;

          return (
            <div key={msg._id || msg.id} className={`chat-message ${isMine ? "me" : "them"}`}>
              {renderMessageContent(msg.text)}
            </div>
          );
        })}
      </div>

      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <div className="chat-icons" style={{ position: "relative" }}>
            <button
              title="Emoji"
              type="button"
              onClick={() => setShowEmojiPicker((v) => !v)}
              style={{ fontSize: "28px", cursor: "pointer" }}
            >
              😊
            </button>
          </div>

          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write a message..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="chat-input"
            rows={2}
          />
        </div>
        <button className="chat-send-button" onClick={sendMessage}>
          📤
        </button>
      </div>

      {showEmojiPicker && <EmojiPicker onClose={() => setShowEmojiPicker(false)} onEmojiSelect={handleEmojiSelect} />}
    </div>
  );
}
