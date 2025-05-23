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

    const pickerWidth = pickerRef.current?.clientWidth || 0;
    const pickerHeight = pickerRef.current?.clientHeight || 0;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let newX = e.clientX - offset.current.x;
    let newY = e.clientY - offset.current.y;

    if (newX < 0) newX = 0;
    else if (newX + pickerWidth > windowWidth) newX = windowWidth - pickerWidth;

    if (newY < 0) newY = 0;
    else if (newY + pickerHeight > windowHeight) newY = windowHeight - pickerHeight;

    setPickerPosition({ x: newX, y: newY });
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
