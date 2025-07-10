"use client";

import { motion } from 'framer-motion';
import { AssistantIcon } from './Icons';

interface MainToolbarProps {
  onOpenAssistantNotes: () => void;
}

const MainToolbar = ({ onOpenAssistantNotes }: MainToolbarProps) => {
  return (
    <motion.div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-stone-800/80 backdrop-blur-md rounded-full shadow-lg p-2 flex items-center justify-center space-x-4 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
    >
      <button
        onClick={onOpenAssistantNotes}
        className="p-3 rounded-full bg-red-700 hover:bg-red-800 text-stone-100 shadow-md transition-colors duration-200 flex items-center justify-center"
        title="Assistant Notes"
      >
        <AssistantIcon className="w-6 h-6" />
      </button>
      {/* Add other toolbar buttons here in the future */}
    </motion.div>
  );
};

export default MainToolbar;