"use client";

import { useState } from 'react';
import { WorldState, Character, Location, Item, LoreEntry } from '@/types';
import { CharacterIcon, LocationIcon, ItemIcon, LoreIcon, ChevronIcon } from './Icons';

const AccordionSection = ({ title, icon, children, isOpen, onToggle }: { title: string, icon: JSX.Element, children: React.ReactNode, isOpen: boolean, onToggle: () => void }) => {
  return (
    <div className="border-b border-stone-700/50">
      <button onClick={onToggle} className="w-full flex items-center justify-between p-3 hover:bg-stone-800/50 transition-colors duration-200">
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium text-stone-200">{title}</span>
        </div>
        <ChevronIcon className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-3 bg-stone-900/50">
          {children}
        </div>
      )}
    </div>
  );
};

const Codex = ({ data, onSelectEntity, selectedEntityId }: { data: WorldState | null, onSelectEntity: (entity: any) => void, selectedEntityId: string | null }) => {
  const [openSection, setOpenSection] = useState<string | null>('Characters');

  if (!data || !data.worldState) return null;

  const { characters, locations, items, loreEntries } = data.worldState;

  const sections = [
    { title: 'Characters', icon: <CharacterIcon />, entities: Object.values(characters || {}) },
    { title: 'Locations', icon: <LocationIcon />, entities: Object.values(locations || {}) },
    { title: 'Items', icon: <ItemIcon />, entities: Object.values(items || {}) },
    { title: 'Lore', icon: <LoreIcon />, entities: Object.values(loreEntries || {}) },
  ];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar z-20">
      {sections.map(({ title, icon, entities }) => (
        <AccordionSection
          key={title}
          title={title}
          icon={icon}
          isOpen={openSection === title}
          onToggle={() => setOpenSection(openSection === title ? null : title)}
        >
          <div className="space-y-2">
            {entities.map((entity: any) => (
              <div
                key={entity.id}
                onClick={() => onSelectEntity(entity)}
                className={`p-2 rounded-md cursor-pointer transition-colors duration-150 ${selectedEntityId === entity.id ? 'bg-red-800/50 text-red-200' : 'hover:bg-stone-700/50'}`}>
                {entity.name || entity.title}
              </div>
            ))}
          </div>
        </AccordionSection>
      ))}
    </div>
  );
};

export default Codex;