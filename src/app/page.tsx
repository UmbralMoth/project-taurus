"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SidePanel from '@/components/SidePanel';
import EntityCard from '@/components/EntityCard';
import EntityDetailView from '@/components/EntityDetailView';
import AssistantNotes from '@/components/AssistantNotes';
import SettingsPanel from '@/components/SettingsPanel';
import AIContextPanel from '@/components/AIContextPanel';
import NarrativeTapestry from '@/components/NarrativeTapestry';
import { useStory } from '@/context/StoryContext';
import { NarrativeBeat, Character, Location, Item, LoreEntry } from '@/types';
import { CharacterIcon, LocationIcon, ItemIcon, LoreIcon, AssistantIcon, SettingsIcon, AIContextIcon, ChevronIcon } from '@/components/Icons';
import WorldDataTree from '@/components/WorldDataTree';

export type RightTab = 'Inspector' | 'Tools' | 'Settings';

type SelectedEntity = Character | Location | Item | LoreEntry | null;

export default function Home() {
  const { story, narrativeBeats, addNarrativeBeat, updateEntity, loading, error } = useStory();
  
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  
  const [activeRightTab, setActiveRightTab] = useState<RightTab>('Inspector');
  
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity>(null);

  const handleSend = async (text: string) => {
    if (text) {
      const newBeat: NarrativeBeat = {
        id: (narrativeBeats.length + 1).toString(),
        text,
        source: 'user',
        timestamp: new Date().toISOString(),
        eventID: (narrativeBeats.length + 1).toString(),
      };
      await addNarrativeBeat(newBeat);
    }
  };

  const handleSelectEntity = (entity: SelectedEntity) => {
    setSelectedEntity(entity);
    setActiveRightTab('Inspector');
    setIsRightPanelOpen(true);
  };

  const toggleLeftPanel = () => {
    setIsLeftPanelOpen(!isLeftPanelOpen);
  };

  const toggleRightPanel = (tab: RightTab) => {
    if (activeRightTab === tab && isRightPanelOpen) {
      setIsRightPanelOpen(false);
      if (tab === 'Inspector') setSelectedEntity(null); // Clear selected entity if Inspector tab is closed
    } else {
      setActiveRightTab(tab);
      setIsRightPanelOpen(true);
    }
  };

  const rightTabs = [
    { name: 'Inspector', icon: <CharacterIcon /> }, // Placeholder icon, will be replaced
    { name: 'Tools', icon: <AssistantIcon /> },
    { name: 'Settings', icon: <SettingsIcon /> },
  ];

  const CodexContent = () => {
    if (!story) return null;
    return (
      <WorldDataTree data={story} onSelectEntity={handleSelectEntity} selectedEntityId={selectedEntity?.id || null} />
    );
  };

  const ToolsContent = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-stone-200">Assistant Notes</h3>
        <AssistantNotes notes={[]} />
        <h3 className="text-lg font-bold text-stone-200">AI Context</h3>
        <AIContextPanel />
      </div>
    );
  };

  const handleSaveEntity = async (updatedEntity: SelectedEntity) => {
    if (!updatedEntity) return;
    await updateEntity(updatedEntity);
    setIsRightPanelOpen(false);
  };

  const InspectorContent = () => {
    if (activeRightTab === 'Inspector') {
      return <EntityDetailView entity={selectedEntity} onSave={handleSaveEntity} />;
    }
    if (activeRightTab === 'Tools') {
        return <ToolsContent />;
    }
    if (activeRightTab === 'Settings') {
        return <SettingsPanel />;
    }
    return null;
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-stone-900 text-stone-200">Loading Story...</div>;
  if (error) return <div className="flex h-screen items-center justify-center bg-stone-900 text-red-500">Error: {error}</div>;

  return (
    <div className="flex h-screen bg-stone-900 text-stone-200 font-sans overflow-hidden">
      <AnimatePresence>
        {isLeftPanelOpen && (
          <SidePanel side="left">
            <CodexContent />
          </SidePanel>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="flex-1 flex flex-col"
        animate={{ width: `calc(100% - ${isLeftPanelOpen ? '20rem' : '0rem'} - ${isRightPanelOpen ? '20rem' : '0rem'})` }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <NarrativeTapestry beats={narrativeBeats} onSend={handleSend} />
      </motion.div>
      
      <AnimatePresence>
        {isRightPanelOpen && (
            <SidePanel side="right" tabs={rightTabs} activeTab={activeRightTab} onTabChange={(tab) => setActiveRightTab(tab as RightTab)}>
                <InspectorContent />
            </SidePanel>
        )}
        </AnimatePresence>

      {/* Left Panel Toggle Button */}
      <motion.button
        className="absolute top-1/2 -translate-y-1/2 left-0 p-2 bg-stone-800/50 rounded-r-lg shadow-lg z-10"
        onClick={toggleLeftPanel}
        initial={{ x: 0 }}
        animate={{ x: isLeftPanelOpen ? '20rem' : '0rem' }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <ChevronIcon isOpen={isLeftPanelOpen} direction="right" />
      </motion.button>

      {/* Right Panel Toggle Button */}
      <motion.button
        className="absolute top-1/2 -translate-y-1/2 right-0 p-2 bg-stone-800/50 rounded-l-lg shadow-lg z-10"
        onClick={() => toggleRightPanel(activeRightTab)} // Pass current activeRightTab to toggle
        initial={{ x: 0 }}
        animate={{ x: isRightPanelOpen ? '-20rem' : '0rem' }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <ChevronIcon isOpen={isRightPanelOpen} direction="left" />
      </motion.button>
    </div>
  );
}
