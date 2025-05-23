import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';




import "./ChatPage.css";

const messagesMock = [
  { id: 1, text: "Привіт! Як справи?", sender: "them" },
  { id: 2, text: "Все добре, дякую!", sender: "me" },
];

export default function ChatPage() {
  const { chatId } = useParams();

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    console.log("Chat ID:", chatId);
  }, [chatId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), text: newMessage, sender: "me" }]);
    setNewMessage("");
  };

const addEmoji = (emoji) => {
  setNewMessage((prev) => prev + emoji.native);
};


  return (
    <div className="chat-container dark" style={{ position: "relative" }}>
      <header className="chat-header">
        <img src="/img/account.png" alt="Avatar" className="chat-avatar" />
        <h2 className="chat-title">Сhat with Назарієм</h2>
      </header>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.sender === "me" ? "me" : "them"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <div className="chat-icons" style={{ position: "relative" }}>
            <label>
              <input type="file" hidden />
              <span title="Add a photo">📷</span>
            </label>
            <label>
              <input type="file" hidden />
              <span title="File">📎</span>
            </label>
            <button
              title="Emoji"
              type="button"
              onClick={() => setShowEmojiPicker((v) => !v)}
              style={{ fontSize: "20px", cursor: "pointer" }}
            >
              😊
            </button>

 {showEmojiPicker && (
  <div
    style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 1000,
      backgroundColor: "#1e1e1e",
      borderRadius: "10px",
      padding: "10px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
    }}
  >
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <button
        onClick={() => setShowEmojiPicker(false)}
        style={{
          background: "transparent",
          color: "#fff",
          border: "none",
          fontSize: "18px",
          cursor: "pointer",
          marginBottom: "5px",
        }}
      >
        ✕
      </button>
    </div>
    <Picker data={data} onEmojiSelect={addEmoji} theme="dark" />
  </div>
)}





          </div>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write a message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
        </div>
        <button className="chat-send-button" onClick={sendMessage}>
          📤
        </button>
      </div>
    </div>
  );
}
