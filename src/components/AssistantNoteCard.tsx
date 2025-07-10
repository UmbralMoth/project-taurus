"use client";

import { AssistantNote } from '@/types';

interface AssistantNoteCardProps {
  note: AssistantNote;
}

const AssistantNoteCard = ({ note }: AssistantNoteCardProps) => {
  return (
    <div className="bg-stone-800/70 p-3 rounded-md shadow-sm border border-stone-700/50">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">{note.category}</span>
        <div className="flex gap-2">
          {/* Placeholder for Edit/Delete buttons */}
          <button className="text-stone-400 hover:text-red-400 text-sm">Edit</button>
          <button className="text-stone-400 hover:text-red-400 text-sm">Delete</button>
        </div>
      </div>
      <p className="text-stone-300 text-sm whitespace-pre-wrap mb-2">{note.content}</p>
      {note.targetIDs && note.targetIDs.length > 0 && (
        <p className="text-stone-500 text-xs">Targets: {note.targetIDs.join(', ')}</p>
      )}
      <p className="text-stone-600 text-xs text-right">{new Date(note.timestamp).toLocaleString()}</p>
    </div>
  );
};

export default AssistantNoteCard;