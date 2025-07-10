"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SidePanel from '@/components/SidePanel';
import EntityDetailView from '@/components/EntityDetailView';
import AssistantNotes from '@/components/AssistantNotes';
import SettingsPanel from '@/components/SettingsPanel';
import AIContextPanel from '@/components/AIContextPanel';
import NarrativeTapestry from '@/components/NarrativeTapestry';
import { useStory } from '@/context/StoryContext';
import { NarrativeBeat, Character, Location, Item, LoreEntry } from '@/types';
import { CharacterIcon, AssistantIcon, SettingsIcon, ChevronIcon } from '@/components/Icons';
import Codex from '@/components/Codex';
import { useIsMobile } from '@/hooks/useIsMobile';

export type RightTab = 'Inspector' | 'Tools' | 'Settings';

type SelectedEntity = Character | Location | Item | LoreEntry | null;

export default function Home() {
  const { story, narrativeBeats, addNarrativeBeat, updateEntity, loading, error } = useStory();
  const isMobile = useIsMobile();
  
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
    if (isMobile) {
      setIsLeftPanelOpen(false);
      setIsRightPanelOpen(true);
    } else {
      setIsRightPanelOpen(true);
    }
  };

  const toggleLeftPanel = () => {
    setIsLeftPanelOpen(!isLeftPanelOpen);
  };

  const toggleRightPanel = (tab: RightTab) => {
    if (activeRightTab === tab && isRightPanelOpen) {
      setIsRightPanelOpen(false);
      if (tab === 'Inspector') setSelectedEntity(null);
    } else {
      setActiveRightTab(tab);
      setIsRightPanelOpen(true);
    }
  };

  const rightTabs = [
    { name: 'Inspector', icon: <CharacterIcon /> },
    { name: 'Tools', icon: <AssistantIcon /> },
    { name: 'Settings', icon: <SettingsIcon /> },
  ];

  const CodexContent = () => {
    if (!story) return null;
    return (
      <Codex data={story} onSelectEntity={handleSelectEntity} selectedEntityId={selectedEntity?.id || null} />
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
      return <EntityDetailView entity={selectedEntity} onSave={handleSaveEntity} onBack={() => { setIsRightPanelOpen(false); setIsLeftPanelOpen(true); }} isMobile={isMobile} />;
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
          <SidePanel side="left" isMobile={isMobile}>
            <CodexContent />
          </SidePanel>
        )}
      </AnimatePresence>
      
      <main className="flex-1 flex flex-col relative">
        <NarrativeTapestry beats={narrativeBeats} onSend={handleSend} />
      </main>
      
      <AnimatePresence>
        {isRightPanelOpen && (
            <SidePanel side="right" isMobile={isMobile} tabs={rightTabs} activeTab={activeRightTab} onTabChange={(tab) => setActiveRightTab(tab as RightTab)}>
                <InspectorContent />
            </SidePanel>
        )}
        </AnimatePresence>

      <motion.button
        className="absolute top-1/2 -translate-y-1/2 left-0 p-2 bg-stone-800/50 rounded-r-lg shadow-lg z-10"
        onClick={toggleLeftPanel}
        initial={{ x: 0 }}
        animate={{ x: isLeftPanelOpen ? (isMobile ? '100vw' : '20rem') : '0rem' }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <ChevronIcon className={`transition-transform duration-300 ${isLeftPanelOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <motion.button
        className="absolute top-1/2 -translate-y-1/2 right-0 p-2 bg-stone-800/50 rounded-l-lg shadow-lg z-10"
        onClick={() => toggleRightPanel(activeRightTab)}
        initial={{ x: 0 }}
        animate={{ x: isRightPanelOpen ? (isMobile ? '-100vw' : '-20rem') : '0rem' }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <ChevronIcon className={`transition-transform duration-300 ${isRightPanelOpen ? '' : 'rotate-180'}`} />
      </motion.button>
    </div>
  );
}
