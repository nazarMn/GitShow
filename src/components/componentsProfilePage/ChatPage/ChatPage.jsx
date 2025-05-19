import React, { useState } from "react";
import "./ChatPage.css";

const messagesMock = [
  { id: 1, text: "Привіт! Як справи?", sender: "them" },
  { id: 2, text: "Все добре, дякую!", sender: "me" },
];

export default function ChatPage() {
  const [messages, setMessages] = useState(messagesMock);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), text: newMessage, sender: "me" }]);
    setNewMessage("");
  };

  return (
    <div className="chat-container dark">
      <header className="chat-header">
        <img src="/img/account.png" alt="Avatar" className="chat-avatar" />
        <h2 className="chat-title">Чат з Назарієм</h2>
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
    <div className="chat-icons">
      <label>
        <input type="file" hidden />
        <span title="Додати фото">📷</span>
      </label>
      <label>
        <input type="file" hidden />
        <span title="Файл">📎</span>
      </label>
      <button title="Emoji">😊</button>
    </div>

    <input
      type="text"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      placeholder="Напишіть повідомлення..."
      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
    />
  </div>
  <button className="chat-send-button" onClick={sendMessage}>📤</button>
</div>

    </div>
  );
}
