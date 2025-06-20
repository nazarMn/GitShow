import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import EmojiPicker from "./EmojiPicker";
import "./ChatPage.css";

const socket = io("http://localhost:3000"); // змінити на твій продакшн URL

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

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/${chatId}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
    socket.emit("joinRoom", chatId);

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [chatId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, text: newMessage }),
      });

      if (!res.ok) {
        console.error("Failed to send message");
        return;
      }

      const data = await res.json();
      const messageObj = { ...data, sender: { _id: currentUserId } };

      // Додаємо собі
      setMessages((prev) => [...prev, messageObj]);

      // Відправляємо іншим
      socket.emit("sendMessage", {
        chatId,
        message: messageObj,
      });

      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
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
