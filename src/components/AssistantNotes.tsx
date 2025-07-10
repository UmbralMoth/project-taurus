"use client";

import { AssistantNote } from "@/types";

interface AssistantNotesProps {
  notes: AssistantNote[];
}

const AssistantNotes = ({ notes }: AssistantNotesProps) => {
  return (
    <div className="flex-1 w-full bg-gray-800 text-gray-100 p-4 rounded-lg overflow-y-auto custom-scrollbar">
      {notes.map((note) => (
        <div key={note.id} className="mb-4 p-3 rounded-lg shadow bg-gray-700">
          <p className="text-sm font-bold mb-1 capitalize">{note.category}</p>
          <p className="whitespace-pre-wrap">{note.content}</p>
        </div>
      ))}
    </div>
  );
};

export default AssistantNotes;
