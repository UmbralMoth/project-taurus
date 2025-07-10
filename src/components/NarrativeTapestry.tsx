"use client";

import { useState, useRef, useEffect, Fragment, useLayoutEffect } from 'react';
import { NarrativeBeat } from '@/types';
import DynamicConnector from './DynamicConnector';



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

// --- Narrative Timeline Component ---
const NarrativeTapestry = ({ beats, onSend }: { beats: NarrativeBeat[], onSend: (text: string) => void }) => {
  const [isWriting, setIsWriting] = useState(false);
  const endOfTapestryRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const [continuationMode, setContinuationMode] = useState('idle'); // 'idle', 'suggesting_options', 'user_writing', 'ai_auto'
  const [suggestedOptions, setSuggestedOptions] = useState<string[]>([]);

  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [connectorCoords, setConnectorCoords] = useState<{ start: { x: number; y: number }; end: { x: number; y: number } }[]>([]);

  useEffect(() => {
    endOfTapestryRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [beats, isWriting]);

  // Calculate connector coordinates
  useLayoutEffect(() => {
    const newCoords: { start: { x: number; y: number }; end: { x: number; y: number } }[] = [];
    if (beatRefs.current.length > 1) {
      for (let i = 0; i < beatRefs.current.length - 1; i++) {
        const startBeat = beatRefs.current[i];
        const endBeat = beatRefs.current[i + 1];

        if (startBeat && endBeat) {
          const startRect = startBeat.getBoundingClientRect();
          const endRect = endBeat.getBoundingClientRect();

          const startX = startRect.left + startRect.width / 2;
          const startY = startRect.bottom;
          const endX = endRect.left + endRect.width / 2;
          const endY = endRect.top;

          newCoords.push({ start: { x: startX, y: startY }, end: { x: endX, y: endY } });
        }
      }
    }
    setConnectorCoords(newCoords);
  }, [beats]); // Recalculate when beats change

  // Recalculate on scroll and resize
  useEffect(() => {
    const handleScrollOrResize = () => {
      const newCoords: { start: { x: number; y: number }; end: { x: number; y: number } }[] = [];
      if (beatRefs.current.length > 1) {
        for (let i = 0; i < beatRefs.current.length - 1; i++) {
          const startBeat = beatRefs.current[i];
          const endBeat = beatRefs.current[i + 1];

          if (startBeat && endBeat) {
            const startRect = startBeat.getBoundingClientRect();
            const endRect = endBeat.getBoundingClientRect();

            const startX = startRect.left + startRect.width / 2;
            const startY = startRect.bottom;
            const endX = endRect.left + endRect.width / 2;
            const endY = endRect.top;

            newCoords.push({ start: { x: startX, y: startY }, end: { x: endX, y: endY } });
          }
        }
      }
      setConnectorCoords(newCoords);
    };

    scrollContainerRef.current?.addEventListener('scroll', handleScrollOrResize);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      scrollContainerRef.current?.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [beats]);

  const handleSendWrapper = (text: string) => {
    onSend(text);
    setIsWriting(false);
    setContinuationMode('idle'); // Reset mode after sending
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setStartY(e.pageY - scrollContainerRef.current.offsetTop);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    setScrollTop(scrollContainerRef.current.scrollTop);
    scrollContainerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault(); // Prevent text selection
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const y = e.pageY - scrollContainerRef.current.offsetTop;
    const walkX = (x - startX);
    const walkY = (y - startY);
    scrollContainerRef.current.scrollLeft = scrollLeft - walkX;
    scrollContainerRef.current.scrollTop = scrollTop - walkY;
  };

  const handleMouseUp = () => {
    if (!scrollContainerRef.current) return;
    setIsDragging(false);
    scrollContainerRef.current.style.cursor = 'grab';
  };

  const handleMouseLeave = () => {
    if (!scrollContainerRef.current) return;
    setIsDragging(false);
    scrollContainerRef.current.style.cursor = 'grab';
  };

  const handleSuggestOptions = () => {
    setContinuationMode('suggesting_options');
    // Placeholder for AI-generated options
    setSuggestedOptions([
      "A mysterious stranger enters the tavern.",
      "The ancient ruins reveal a hidden passage.",
      "A sudden storm engulfs the ship.",
    ]);
  };

  const handleSelectOption = (option: string) => {
    onSend(option); // Send the selected option as narrative
    setContinuationMode('idle');
    setSuggestedOptions([]);
  };

  const handleAIAutoContinue = () => {
    onSend("AI_AUTO_CONTINUE"); // Special signal for AI to continue
    setContinuationMode('idle');
  };

  return (
    <div 
      ref={scrollContainerRef}
      className={`flex-1 w-full flex justify-center overflow-y-auto custom-scrollbar py-10 px-4 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Render Dynamic Connectors */}
      {connectorCoords.map((coords, index) => (
        <DynamicConnector key={index} start={coords.start} end={coords.end} />
      ))}

      <div className="flex flex-col items-center w-full max-w-2xl space-y-8">
        {/* Render the narrative beats */}
        {beats.map((beat, index) => (
          <Fragment key={beat.id}>
            {beat.source === 'user' ? (
              // User Action Node (Pill Shape - Wax Seal)
              <div ref={el => beatRefs.current[index] = el} className="flex items-center justify-center h-16 max-w-xs p-5 rounded-full shadow-lg bg-red-900/50 border border-red-700/50 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 to-red-700/80 opacity-70 rounded-full"></div>
                <p className="italic text-center text-stone-100 relative z-10">{beat.text}</p>
              </div>
            ) : (
              // Gemini Narrative Block (Rectangle - Parchment Fragment)
              <div ref={el => beatRefs.current[index] = el} className="w-full p-4 rounded-lg shadow-lg bg-stone-800/60 border border-stone-700/50 relative">
                <div className="absolute inset-0 bg-stone-100 opacity-5 rounded-lg z-0"></div>
                <p className="whitespace-pre-wrap text-stone-200 relative z-10">{beat.text}</p>
              </div>
            )}
          </Fragment>
        ))}

        {/* Narrative Continuation Options */}
        <div ref={endOfTapestryRef} className="w-full flex flex-col items-center space-y-4">
          {continuationMode === 'idle' && (
            <div className="w-full max-w-md flex flex-col items-center space-y-4 p-6 bg-stone-900/70 rounded-xl shadow-2xl border border-stone-700/50 backdrop-blur-sm relative overflow-hidden">
              <p className="text-stone-300 text-lg font-semibold mb-2 z-10">What will you do next?</p>
              
              {/* Write Option - Primary */}
              <button 
                onClick={() => setContinuationMode('user_writing')}
                className="w-full px-6 py-4 bg-red-800/70 hover:bg-red-700/80 rounded-lg text-stone-100 font-bold text-xl shadow-lg transition-all duration-300 transform hover:scale-105 border border-red-600/70 z-20"
              >
                Write
              </button>

              {/* Suggest Option */}
              <button 
                onClick={handleSuggestOptions}
                className="w-full px-6 py-3 bg-stone-700/60 hover:bg-stone-600/70 rounded-lg text-stone-200 font-medium shadow-md transition-colors duration-200 border border-stone-600/50 z-10 -mt-2"
              >
                Suggest
              </button>

              {/* Continue Option */}
              <button 
                onClick={handleAIAutoContinue}
                className="w-full px-6 py-3 bg-stone-800/50 hover:bg-stone-700/60 rounded-lg text-stone-400 font-medium shadow-md transition-colors duration-200 border border-stone-700/50 z-0 -mt-2"
              >
                Continue
              </button>
            </div>
          )}

          {continuationMode === 'suggesting_options' && (
            <div className="flex flex-col space-y-3 w-full max-w-md p-4 bg-stone-800/50 rounded-lg shadow-xl border border-stone-700/50">
              <h3 className="text-stone-200 text-center text-lg font-semibold mb-4">Choose a Path:</h3>
              {suggestedOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectOption(option)}
                  className="w-full p-4 bg-stone-700/70 hover:bg-stone-600/80 rounded-lg text-stone-100 font-medium shadow-md transition-colors duration-200 text-left border border-stone-600"
                >
                  {option}
                </button>
              ))}
              <button
                onClick={() => setContinuationMode('idle')}
                className="w-full px-4 py-2 bg-stone-700 hover:bg-stone-600 rounded-lg text-stone-100 font-medium shadow-md transition-colors duration-200 mt-4"
              >
                Back to Options
              </button>
            </div>
          )}

          {continuationMode === 'user_writing' && (
            <InlineInput onSend={handleSendWrapper} />
          )}
        </div>
      </div>
    </div>
  );
};

export default NarrativeTapestry;