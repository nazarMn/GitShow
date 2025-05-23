import React, { useEffect, useState, useRef } from "react";
import Picker from "@emoji-mart/react";

import data from "@emoji-mart/data";

export default function EmojiPicker({ onClose, onEmojiSelect }) {
  const [pickerPosition, setPickerPosition] = useState({ x: 200, y: 200 });
  const pickerRef = useRef(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const saved = localStorage.getItem("emojiPickerPosition");
    if (saved) {
      setPickerPosition(JSON.parse(saved));
    }
  }, []);

  const handleMouseDown = (e) => {
    dragging.current = true;
    offset.current = {
      x: e.clientX - pickerPosition.x,
      y: e.clientY - pickerPosition.y,
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!dragging.current) return;
    const newPos = {
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    };
    setPickerPosition(newPos);
  };

  const handleMouseUp = () => {
    dragging.current = false;
    localStorage.setItem("emojiPickerPosition", JSON.stringify(pickerPosition));
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={pickerRef}
      onMouseDown={handleMouseDown}
      style={{
        position: "fixed",
        left: `${pickerPosition.x}px`,
        top: `${pickerPosition.y}px`,
        zIndex: 1000,
        backgroundColor: "#1e1e1e",
        borderRadius: "10px",
        padding: "10px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
        cursor: "grab",
      }}
    >
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={onClose}
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
      <Picker data={data} onEmojiSelect={onEmojiSelect} theme="dark" />
    </div>
  );
}
