import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import "./ChatPage.css";

const messagesMock = [
  { id: 1, text: "Привіт! Як справи?", sender: "them" },
  { id: 2, text: "Все добре, дякую!", sender: "me" },
];

export default function ChatPage() {
   const { chatId } = useParams();

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log('Chat ID:', chatId);
  }, [chatId]);


  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), text: newMessage, sender: "me" }]);
    setNewMessage("");
  };

  

  return (
    <div className="chat-container dark">
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
    <div className="chat-icons">
      <label>
        <input type="file" hidden />
        <span title="Add a photo">📷</span>
      </label>
      <label>
        <input type="file" hidden />
        <span title="File">📎</span>
      </label>
      <button title="Emoji">😊</button>
    </div>

    <input
      type="text"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      placeholder="Write a message..."
      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
    />
  </div>
  <button className="chat-send-button" onClick={sendMessage}>📤</button>
</div>

    </div>
  );
}
