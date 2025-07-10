"use client";

import { useState } from 'react';

interface UserInputProps {
  onSend: (text: string) => void;
}

const UserInput = ({ onSend }: UserInputProps) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <div className="relative flex-1">
      <textarea
        className="flex-1 w-full bg-gray-700 text-gray-100 p-4 pr-12 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out custom-scrollbar"
        rows={3}
        placeholder="Type your input here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      ></textarea>
      <button
        className="absolute top-1/2 -translate-y-1/2 right-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition duration-200 ease-in-out flex items-center justify-center"
        onClick={handleSend}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </button>
    </div>
  );
};

export default UserInput;
