"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SidePanel from '@/components/SidePanel';
import EntityDetailView from '@/components/EntityDetailView';

import WorldPanel from '@/components/WorldPanel';
import AssistantPanel from '@/components/AssistantPanel';
import NarrativeTapestry from '@/components/NarrativeTapestry';
import { useStory } from '@/context/StoryContext';
import { NarrativeBeat, Character, Location, Item, LoreEntry } from '@/types';
import { CharacterIcon, AssistantIcon, SettingsIcon, ChevronIcon } from '@/components/Icons';
import Codex from '@/components/Codex';
import { useIsMobile } from '@/hooks/useIsMobile';
import MainToolbar from '@/components/MainToolbar';
import AssistantNotesModal from '@/components/AssistantNotesModal';

export type RightTab = 'Inspector' | 'Tools' | 'Settings';

type SelectedEntity = Character | Location | Item | LoreEntry | null;

const CodexContent = ({ story, onSelectEntity, selectedEntityId, openSections, onToggleSection, searchTerm, onSearchChange, activeEntityIds, onToggleActiveEntity }: any) => {
  if (!story) return null;
  return (
    <Codex 
      data={story} 
      onSelectEntity={onSelectEntity} 
      selectedEntityId={selectedEntityId}
      openSections={openSections}
      onToggleSection={onToggleSection}
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      activeEntityIds={activeEntityIds}
      onToggleActiveEntity={onToggleActiveEntity}
    />
  );
};

export default function Home() {
  const { story, narrativeBeats, addNarrativeBeat, updateEntity, loading, error } = useStory();
  const isMobile = useIsMobile();
  
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [isAssistantNotesModalOpen, setIsAssistantNotesModalOpen] = useState(false);
  
  const [activeRightTab, setActiveRightTab] = useState<RightTab>('Inspector');
  
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity>(null);
  const [openCodexSections, setOpenCodexSections] = useState<string[]>(['Characters']);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeEntityIds, setActiveEntityIds] = useState<string[]>([]);

  const handleToggleActiveEntity = (entityId: string) => {
    setActiveEntityIds(prevActiveEntityIds => {
      if (prevActiveEntityIds.includes(entityId)) {
        return prevActiveEntityIds.filter(id => id !== entityId);
      } else {
        return [...prevActiveEntityIds, entityId];
      }
    });
  };

  const handleToggleCodexSection = (sectionTitle: string) => {
    setOpenCodexSections(prevOpenSections => {
      if (prevOpenSections.includes(sectionTitle)) {
        return prevOpenSections.filter(title => title !== sectionTitle);
      } else {
        return [...prevOpenSections, sectionTitle];
      }
    });
  };

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
    { name: 'World', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.002 6.002 0 0111.336 0l.001.002.002.002.002.003a.75.75 0 01-1.06 1.06l-.002-.002a4.501 4.501 0 00-9.214 0l-.002.002a.75.75 0 01-1.06-1.06l.002-.003.002-.002.001-.002z" clipRule="evenodd" /></svg> },
    { name: 'Assistant', icon: <AssistantIcon /> },
  ];

  

  const handleSaveEntity = async (updatedEntity: SelectedEntity) => {
    if (!updatedEntity) return;
    await updateEntity(updatedEntity);
    setIsRightPanelOpen(false);
  };

  const InspectorContent = () => {
    if (activeRightTab === 'Inspector') {
      return <EntityDetailView entity={selectedEntity} onSave={handleSaveEntity} onBack={() => { setIsRightPanelOpen(false); setIsLeftPanelOpen(true); }} isMobile={isMobile} />;
    }
    if (activeRightTab === 'World') {
        return <WorldPanel />;
    }
    if (activeRightTab === 'Assistant') {
        return <AssistantPanel />;
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
            <CodexContent 
              story={story}
              onSelectEntity={handleSelectEntity}
              selectedEntityId={selectedEntity?.id || null}
              openSections={openCodexSections}
              onToggleSection={handleToggleCodexSection}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              activeEntityIds={activeEntityIds}
              onToggleActiveEntity={handleToggleActiveEntity}
            />
          </SidePanel>
        )}
      </AnimatePresence>
      
      <main className="flex-1 flex flex-col relative pb-24 bg-stone-900/80">
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

      <MainToolbar onOpenAssistantNotes={() => setIsAssistantNotesModalOpen(prev => !prev)} />
      <AssistantNotesModal isOpen={isAssistantNotesModalOpen} onClose={() => setIsAssistantNotesModalOpen(false)} />
    </div>
  );
}