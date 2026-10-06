import React, { useEffect, useState, useRef } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { tw } from "@/shared/lib/tailwind";

interface EmojiPickerProps {
  onClose: () => void;
  onEmojiSelect: (emoji: { native: string }) => void;
}

export default function EmojiPicker({ onClose, onEmojiSelect }: EmojiPickerProps) {
  const [pickerPosition, setPickerPosition] = useState({ x: 200, y: 200 });
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const saved = localStorage.getItem("emojiPickerPosition");
    if (saved) {
      setPickerPosition(JSON.parse(saved));
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    dragging.current = true;
    offset.current = {
      x: e.clientX - pickerPosition.x,
      y: e.clientY - pickerPosition.y,
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
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
      className={tw('fixed z-[1000] bg-[#1e1e1e] rounded-[10px] p-[10px] shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-grab')}
      style={{ left: `${pickerPosition.x}px`, top: `${pickerPosition.y}px` }}
    >
      <div className={tw("flex justify-end")}>
        <button
          onClick={onClose}
          className={tw('bg-transparent text-white border-0 text-[18px] cursor-pointer mb-[5px]')}
        >
          ✕
        </button>
      </div>
      <Picker data={data} onEmojiSelect={onEmojiSelect} theme="dark" />
    </div>
  );
}
