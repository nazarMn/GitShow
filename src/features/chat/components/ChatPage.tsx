import React, { useState, useEffect, useRef } from "react";
import type { ChatMessage, UserSummary } from "@/shared/types/domain";
import type { CurrentUserResponse } from "@/shared/types/api";
import { readJson } from "@/shared/lib/http";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import EmojiPicker from "@/features/chat/components/EmojiPicker";
import { saveMessages, loadMessages } from "@/features/chat/lib/indexedDb";
import CryptoJS from "crypto-js";
import LZString from "lz-string";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import hljs from "highlight.js/lib/core";
import javascriptHighlight from "highlight.js/lib/languages/javascript";
import typescriptHighlight from "highlight.js/lib/languages/typescript";
import pythonHighlight from "highlight.js/lib/languages/python";
import jsonHighlight from "highlight.js/lib/languages/json";
import bashHighlight from "highlight.js/lib/languages/bash";
import { tw } from '@/shared/lib/tailwind';


const SECRET_KEY = "super-secret-key";
const socket = io();

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('bash', bash);

hljs.registerLanguage('javascript', javascriptHighlight);
hljs.registerLanguage('typescript', typescriptHighlight);
hljs.registerLanguage('python', pythonHighlight);
hljs.registerLanguage('json', jsonHighlight);
hljs.registerLanguage('bash', bashHighlight);

const encryptAndCompress = (text: string) => {
  const compressed = LZString.compressToBase64(text);
  return CryptoJS.AES.encrypt(compressed, SECRET_KEY).toString();
};


const decryptAndDecompress = (encrypted: string): string => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    return LZString.decompressFromBase64(decrypted) ?? '';
  } catch (err) {
    console.error("Failed to decrypt/decompress:", err);
    return "[Error decrypting message]";
  }
};


export default function ChatPage() {
  const { chatId: routeChatId } = useParams();
  const chatId = routeChatId ?? '';
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chatUser, setChatUser] = useState<UserSummary | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const currentRes = await fetch("/api/current-user");
        const currentData = await readJson<CurrentUserResponse>(currentRes);
        setCurrentUserId(currentData.id);

        const [id1, id2] = chatId.split("-");
        const otherUserId = id1 === currentData.id ? id2 : id1;
        const userRes = await fetch(`/api/user/${otherUserId}`);
        const userData = await readJson<UserSummary>(userRes);
        setChatUser(userData);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUsers();
  }, [chatId]);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`/api/messages/${chatId}`);
        if (!res.ok) return;
        const data = await readJson<ChatMessage[]>(res);
        const decrypted = data.map((msg) => ({
          ...msg,
          text: decryptAndDecompress(msg.text),
        }));
        setMessages(decrypted);
        saveMessages(chatId, decrypted);
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    }
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    async function loadCache() {
      const msgs = await loadMessages(chatId);
      if (msgs?.length) setMessages(msgs);
    }
    loadCache();
  }, [chatId]);

  useEffect(() => {
    socket.emit("joinRoom", chatId);

    socket.on("receiveMessage", (message) => {
      const decrypted = {
        ...message,
        text: decryptAndDecompress(message.text),
      };
      setMessages((prev) => {
        if (prev.find((m) => m._id === message._id)) return prev;
        const updated = [...prev, decrypted];
        saveMessages(chatId, updated);
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
    const encryptedText = encryptAndCompress(newMessage);
    socket.emit("sendMessage", {
      chatId,
      text: encryptedText,
      senderId: currentUserId,
    });
    setNewMessage("");
  };

  const handleEmojiSelect = (emoji: { native: string }) => {
    setNewMessage((prev) => prev + emoji.native);
  };

  const renderMessageContent = (text: string): React.ReactNode[] => {
    const regex = /```(\w+)?[\s\n]?([\s\S]*?)```/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const [fullMatch, langHint, code] = match;
      const start = match.index;
      if (start > lastIndex) {
        parts.push(<p key={lastIndex}>{text.slice(lastIndex, start)}</p>);
      }

      const detectedLanguage = langHint || hljs.highlightAuto(code).language || "text";
      const languageAliases: Record<string, string> = {
        js: 'javascript',
        ts: 'typescript',
        py: 'python',
        sh: 'bash',
        shell: 'bash',
      };
      const lang = languageAliases[detectedLanguage.toLowerCase()] ?? detectedLanguage.toLowerCase();
      parts.push(
        <div className={tw("code-block relative")} key={start}>
          <div className={tw("text-[12px] text-[#aaa] mb-[4px]")}>
            <strong>Language:</strong> {lang}
          </div>
          <SyntaxHighlighter language={lang} style={oneDark}>
            {code}
          </SyntaxHighlighter>
          <button
            className={tw("copy-button absolute top-[5px] right-[5px] text-[12px] py-[2px] px-[6px] rounded-[5px] bg-[#444] text-white border-0 cursor-pointer")}
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
    <div className={tw("chat-container dark relative")}>
      <header className={tw("chat-header")}>
        <button className={tw("back-button")} onClick={() => navigate(-1)} title="Назад">⬅</button>
        <img src={chatUser?.avatarUrl || "/img/account.png"} alt="Avatar" className={tw("chat-avatar")} />
        <h2 className={tw("chat-title")}>Chat with {chatUser?.username || "User"}</h2>
      </header>

      <div className={tw("chat-messages")} ref={messagesContainerRef}>
        {Array.isArray(messages) ? (
          messages.map((msg) => {
            const senderId = typeof msg.sender === 'string' ? msg.sender : msg.sender?._id;
            const isMine = senderId === currentUserId;
            return (
              <div key={msg._id || msg.id} className={tw(`chat-message ${isMine ? "me" : "them"}`)}>
                {renderMessageContent(msg.text)}
              </div>
            );
          })
        ) : (
          <p>Loading messages...</p>
        )}
      </div>

      <div className={tw("chat-input-area")}>
        <div className={tw("chat-input-wrapper")}>
          <div className={tw("chat-icons relative")}>
            <button title="Emoji" type="button" className={tw("text-[28px]")} onClick={() => setShowEmojiPicker(v => !v)}>
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
            className={tw("chat-input")}
            rows={2}
          />
        </div>
        <button className={tw("chat-send-button")} onClick={sendMessage}>📤</button>
      </div>

      {showEmojiPicker && (
        <EmojiPicker onClose={() => setShowEmojiPicker(false)} onEmojiSelect={handleEmojiSelect} />
      )}
    </div>
  );
}
