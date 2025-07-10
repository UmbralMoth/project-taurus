"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AssistantNote } from '@/types';
import AssistantNoteCard from './AssistantNoteCard';

interface AssistantNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AssistantNotesModal = ({ isOpen, onClose }: AssistantNotesModalProps) => {
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState('General');
  const [newNoteTargetIDs, setNewNoteTargetIDs] = useState('');
  const [notes, setNotes] = useState<AssistantNote[]>([
    // Dummy Notes
    {
      id: 'note-1',
      content: 'AI should prioritize character consistency and avoid sudden personality shifts.',
      timestamp: new Date().toISOString(),
      category: 'Character Guidance',
      targetIDs: [],
    },
    {
      id: 'note-2',
      content: 'Maintain a dark fantasy tone throughout the narrative.',
      timestamp: new Date().toISOString(),
      category: 'Tone',
      targetIDs: [],
    },
    {
      id: 'note-3',
      content: 'Character X (ID: char-xyz) is secretly a spy for the opposing faction.',
      timestamp: new Date().toISOString(),
      category: 'Character Secret',
      targetIDs: ['char-xyz'],
    },
  ]);
  const [isAddingNote, setIsAddingNote] = useState(false);

  const constraintsRef = useRef(null);
  const [dragConstraints, setDragConstraints] = useState({
    top: 0, bottom: 0, left: 0, right: 0
  });

  useEffect(() => {
    if (constraintsRef.current) {
      const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = constraintsRef.current;
      setDragConstraints({
        top: -offsetTop,
        bottom: window.innerHeight - (offsetTop + offsetHeight),
        left: -offsetLeft,
        right: window.innerWidth - (offsetLeft + offsetWidth),
      });
    }

    const handleResize = () => {
      if (constraintsRef.current) {
        const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = constraintsRef.current;
        setDragConstraints({
          top: -offsetTop,
          bottom: window.innerHeight - (offsetTop + offsetHeight),
          left: -offsetLeft,
          right: window.innerWidth - (offsetLeft + offsetWidth),
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]); // Recalculate constraints when modal opens/closes

  const handleAddNote = () => {
    if (newNoteContent.trim() === '') return;

    const newNote: AssistantNote = {
      id: `note-${Date.now()}`,
      content: newNoteContent.trim(),
      timestamp: new Date().toISOString(),
      category: newNoteCategory,
      targetIDs: newNoteTargetIDs.split(',').map(id => id.trim()).filter(id => id !== ''),
    };

    setNotes(prevNotes => [...prevNotes, newNote]);
    setNewNoteContent('');
    setNewNoteCategory('General');
    setNewNoteTargetIDs('');
    setIsAddingNote(false); // Collapse form after adding
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={constraintsRef} // This div defines the draggable area (the whole screen)
          className="fixed inset-0 flex items-center justify-center z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-stone-900 p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto custom-scrollbar border border-stone-700"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
            drag
            dragConstraints={dragConstraints}
            dragElastic={0.2}
            dragMomentum={false}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-stone-200">Assistant Notes</h3>
              <button onClick={onClose} className="text-stone-400 hover:text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Add New Note Section */}
            <div className="mb-4">
              <button
                onClick={() => setIsAddingNote(!isAddingNote)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-stone-800/50 hover:bg-stone-700/50 rounded-md text-stone-200 font-medium transition-colors duration-200 border border-stone-700/50"
              >
                {isAddingNote ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
                {isAddingNote ? 'Collapse Form' : 'Add New Note'}
              </button>

              <AnimatePresence>
                {isAddingNote && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="mt-3 p-4 bg-stone-800/50 rounded-md border border-stone-700/50 overflow-hidden"
                  >
                    <textarea
                      className="w-full p-2 rounded-md bg-stone-700/50 border border-stone-600/50 text-stone-200 placeholder-stone-400 focus:outline-none focus:border-red-500 mb-2 h-24"
                      placeholder="Enter your note for the AI here..."
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                    ></textarea>
                    <div className="flex gap-2 mb-2">
                      <select
                        className="flex-1 p-2 rounded-md bg-stone-700/50 border border-stone-600/50 text-stone-200 text-sm focus:outline-none focus:border-red-500"
                        value={newNoteCategory}
                        onChange={(e) => setNewNoteCategory(e.target.value)}
                      >
                        <option value="General">General</option>
                        <option value="Tone">Tone</option>
                        <option value="Character Guidance">Character Guidance</option>
                        <option value="World Guidance">World Guidance</option>
                        <option value="Constraint">Constraint</option>
                        <option value="Character Secret">Character Secret</option>
                      </select>
                      <input
                        type="text"
                        className="flex-1 p-2 rounded-md bg-stone-700/50 border border-stone-600/50 text-stone-200 placeholder-stone-400 focus:outline-none focus:border-red-500"
                        placeholder="Target Entity IDs (comma-separated)"
                        value={newNoteTargetIDs}
                        onChange={(e) => setNewNoteTargetIDs(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={handleAddNote}
                      className="w-full px-4 py-2 bg-red-700 hover:bg-red-800 rounded-md text-stone-100 font-medium"
                    >
                      Add Note
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Existing Notes List */}
            <div className="p-4 bg-stone-800/50 rounded-md border border-stone-700/50">
              <h4 className="text-md font-semibold text-stone-200 mb-3">Existing Notes</h4>
              {notes.length === 0 ? (
                <p className="text-stone-400 text-sm">No notes added yet.</p>
              ) : (
                <div className="space-y-3">
                  {notes.map(note => (
                    <AssistantNoteCard key={note.id} note={note} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AssistantNotesModal;