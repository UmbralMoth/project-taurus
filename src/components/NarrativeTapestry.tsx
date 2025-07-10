"use client";

import { useState, useRef, useEffect, Fragment } from 'react';
import { NarrativeBeat } from '@/types';

// --- In-line Text Input Component ---
const InlineInput = ({ onSend }: { onSend: (text: string) => void }) => {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape') {
        onSend(""); // Cancels the input
    }
  };

  return (
    <div className="p-4 bg-stone-800/50 rounded-lg border-2 border-dashed border-red-500/50 w-full max-w-2xl">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Weave your story..."
        className="w-full bg-transparent text-stone-100 resize-none focus:outline-none placeholder-stone-500"
        rows={1}
      />
    </div>
  );
};

// --- Vertical Connector ---
const VerticalConnector = () => (
    <div className="h-8 w-px bg-stone-600/80" />
);

// --- Narrative Timeline Component ---
const NarrativeTapestry = ({ beats, onSend }: { beats: NarrativeBeat[], onSend: (text: string) => void }) => {
  const [isWriting, setIsWriting] = useState(false);
  const endOfTapestryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfTapestryRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [beats, isWriting]);

  const handleSendWrapper = (text: string) => {
    onSend(text);
    setIsWriting(false);
  };

  return (
    <div className="flex-1 w-full flex justify-center overflow-y-auto custom-scrollbar py-10 px-4">
      <div className="flex flex-col items-center w-full max-w-2xl space-y-8">
        {/* Render the narrative beats and connectors */}
        {beats.map((beat, index) => (
          <Fragment key={beat.id}>
            {beat.source === 'user' ? (
              // User Action Node (Pill Shape)
              <div className="flex items-center justify-center h-16 max-w-xs p-5 rounded-full shadow-lg bg-red-900/50 border border-red-700/50">
                <p className="italic text-center text-stone-100">{beat.text}</p>
              </div>
            ) : (
              // Gemini Narrative Block (Rectangle)
              <div className="w-full p-4 rounded-lg shadow-lg bg-stone-800/60 border border-stone-700/50">
                <p className="whitespace-pre-wrap text-stone-200">{beat.text}</p>
              </div>
            )}
            
            {/* Render connector only if it's not the last beat */}
            {index < beats.length - 1 && <VerticalConnector />}
          </Fragment>
        ))}

        {/* Render connector to the input area */}
        {beats.length > 0 && <VerticalConnector />}

        {/* Render the input area or the prompt to write */}
        <div ref={endOfTapestryRef} className="w-full">
          {isWriting ? (
            <InlineInput onSend={handleSendWrapper} />
          ) : (
            <button 
              onClick={() => setIsWriting(true)}
              className="flex items-center justify-center w-full h-24 bg-stone-800/50 border-2 border-dashed border-stone-600/80 rounded-lg text-stone-500 hover:bg-stone-700/50 hover:border-stone-500 transition-all duration-200"
            >
              Write what happens next...
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NarrativeTapestry;
