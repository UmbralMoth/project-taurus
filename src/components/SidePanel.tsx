"use client";

import { motion } from 'framer-motion';
import { RightTab } from '@/app/page';

interface SidePanelProps {
  side: 'left' | 'right';
  tabs?: { name: string; icon: JSX.Element }[];
  activeTab?: RightTab;
  onTabChange?: (tab: RightTab) => void;
  children: React.ReactNode;
  isMobile?: boolean;
}

const SidePanel = ({ side, tabs, activeTab, onTabChange, children, isMobile }: SidePanelProps) => {
  return (
    <motion.div
      className={`absolute top-0 h-full bg-stone-800/80 backdrop-blur-md shadow-2xl flex flex-col ${side === 'left' ? 'left-0' : 'right-0'} z-10`}
      initial={{ x: side === 'left' ? '-100%' : '100%' }}
      animate={{ x: '0%' }}
      exit={{ x: side === 'left' ? '-100%' : '100%' }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      style={{ width: isMobile ? '100%' : '20rem' }}
    >
      {tabs && onTabChange && (
        <div className="flex-shrink-0 flex border-b border-stone-700/50">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => onTabChange(tab.name as RightTab)}
              className={`flex-1 p-3 text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${activeTab === tab.name ? 'bg-red-800/30 text-red-300' : 'text-stone-400 hover:bg-stone-800/50'}`}>
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      )}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {children}
      </div>
    </motion.div>
  );
};

export default SidePanel;