"use client";

import { NarrativeBeat } from "@/types";

interface NarrativeDisplayProps {
  beats: NarrativeBeat[];
}

const NarrativeDisplay = ({ beats }: NarrativeDisplayProps) => {
  return (
    <div className="flex-1 w-full bg-gray-800 text-gray-100 p-4 rounded-lg overflow-y-auto custom-scrollbar">
      {beats.map((beat) => (
        <div key={beat.id} className={`mb-4 flex ${beat.source === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-prose p-3 rounded-lg shadow ${beat.source === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
            <p className="text-sm font-bold mb-1 capitalize">{beat.source}</p>
            <p className="whitespace-pre-wrap">{beat.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NarrativeDisplay;
