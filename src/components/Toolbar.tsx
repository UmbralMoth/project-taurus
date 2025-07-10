"use client";

import { CharacterIcon, LocationIcon, ItemIcon, LoreIcon, AssistantIcon, SettingsIcon } from './Icons';
import { LeftTab, RightTab } from '@/app/page';

interface ToolbarProps {
  toggleLeftPanel: (tab: LeftTab) => void;
  toggleRightPanel: (tab: RightTab) => void;
  activeLeftTab: LeftTab | null;
  activeRightTab: RightTab | null;
  isLeftPanelOpen: boolean;
  isRightPanelOpen: boolean;
}

const ToolbarButton = ({ onClick, isActive, children }: { onClick: () => void, isActive: boolean, children: React.ReactNode }) => (
  <button 
    onClick={onClick}
    className={`p-3 transition-colors duration-200 rounded-full ${isActive ? 'bg-red-600 text-white' : 'text-stone-400 hover:bg-stone-700 hover:text-white'}`}>
    {children}
  </button>
);

const Toolbar = ({ toggleLeftPanel, toggleRightPanel, activeLeftTab, activeRightTab, isLeftPanelOpen, isRightPanelOpen }: ToolbarProps) => {
  return (
    <div className="flex items-center space-x-2 bg-stone-800/50 backdrop-blur-md p-2 rounded-full border border-stone-700/50 shadow-2xl">
      <ToolbarButton onClick={() => toggleLeftPanel('Characters')} isActive={isLeftPanelOpen && activeLeftTab === 'Characters'}>
        <CharacterIcon />
      </ToolbarButton>
      <ToolbarButton onClick={() => toggleLeftPanel('Locations')} isActive={isLeftPanelOpen && activeLeftTab === 'Locations'}>
        <LocationIcon />
      </ToolbarButton>
      <ToolbarButton onClick={() => toggleLeftPanel('Items')} isActive={isLeftPanelOpen && activeLeftTab === 'Items'}>
        <ItemIcon />
      </ToolbarButton>
      <ToolbarButton onClick={() => toggleLeftPanel('Lore')} isActive={isLeftPanelOpen && activeLeftTab === 'Lore'}>
        <LoreIcon />
      </ToolbarButton>
      
      <div className="w-px h-6 bg-stone-700/50" />
      
      <ToolbarButton onClick={() => toggleRightPanel('Tools')} isActive={isRightPanelOpen && activeRightTab === 'Tools'}>
        <AssistantIcon />
      </ToolbarButton>
      <ToolbarButton onClick={() => toggleRightPanel('Settings')} isActive={isRightPanelOpen && activeRightTab === 'Settings'}>
        <SettingsIcon />
      </ToolbarButton>
    </div>
  );
};

export default Toolbar;
