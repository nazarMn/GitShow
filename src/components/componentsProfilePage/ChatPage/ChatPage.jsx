import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import EmojiPicker from "./EmojiPicker";
import "./ChatPage.css";

const socket = io("http://localhost:3000"); // змінити на свій сервер

export default function ChatPage() {
  const { chatId } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chatUser, setChatUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const currentRes = await fetch("/api/current-user");
        const currentData = await currentRes.json();

        const [id1, id2] = chatId.split("-");
        const myId = currentData.id;
        setCurrentUserId(myId);

        const otherUserId = id1 === myId ? id2 : id1;
        const userRes = await fetch(`/api/user/${otherUserId}`);
        const userData = await userRes.json();
        setChatUser(userData);
      } catch (error) {
        console.error("Error fetching chat user:", error);
      }
    };

    fetchUsers();
  }, [chatId]);

  // Завантаження локальних повідомлень із localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem(`chat-${chatId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, [chatId]);

  // Підписка на сокети
  useEffect(() => {
    socket.emit("joinRoom", chatId);

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => {
        const updated = [...prev, message];
        localStorage.setItem(`chat-${chatId}`, JSON.stringify(updated));
        return updated;
      });
    });

    return () => {
      socket.off("receiveMessage");
      socket.emit("leaveRoom", chatId);
    };
  }, [chatId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const messageObj = {
      id: Date.now(),
      text: newMessage,
      sender: { _id: currentUserId },
      createdAt: new Date().toISOString(),
    };

    // Локально додаємо повідомлення
    setMessages((prev) => {
      const updated = [...prev, messageObj];
      localStorage.setItem(`chat-${chatId}`, JSON.stringify(updated));
      return updated;
    });

    // Відправляємо на сервер
    socket.emit("sendMessage", { chatId, message: messageObj });

    setNewMessage("");
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prev) => prev + (emoji.native || emoji.colons || ""));
  };

  return (
    <div className="chat-container dark" style={{ position: "relative" }}>
      <header className="chat-header">
        <img
          src={chatUser?.avatarUrl || "/img/account.png"}
          alt="Avatar"
          className="chat-avatar"
        />
        <h2 className="chat-title">
          Chat with {chatUser?.username || "User"}
        </h2>
      </header>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg._id || msg.id}
            className={`chat-message ${
              msg.sender._id === currentUserId ? "me" : "them"
            }`}
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
              style={{ fontSize: "28px", cursor: "pointer" }}
            >
              😊
            </button>
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

      {showEmojiPicker && (
        <EmojiPicker
          onClose={() => setShowEmojiPicker(false)}
          onEmojiSelect={handleEmojiSelect}
        />
      )}
    </div>
  );
}
