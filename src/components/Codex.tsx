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

const Codex = ({ data, onSelectEntity, selectedEntityId, openSections, onToggleSection, searchTerm, onSearchChange, activeEntityIds, onToggleActiveEntity }: { data: WorldState | null, onSelectEntity: (entity: any) => void, selectedEntityId: string | null, openSections: string[], onToggleSection: (section: string) => void, searchTerm: string, onSearchChange: (term: string) => void, activeEntityIds: string[], onToggleActiveEntity: (entityId: string) => void }) => {

  if (!data || !data.worldState) return null;

  const { characters, locations, items, loreEntries } = data.worldState;

  const filterEntities = (entities: any[]) => {
    if (!searchTerm) return entities;
    return entities.filter(entity =>
      (entity.name || entity.title || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const allSections = [
    { title: 'Characters', icon: <CharacterIcon />, entities: Object.values(characters || {}) },
    { title: 'Locations', icon: <LocationIcon />, entities: Object.values(locations || {}) },
    { title: 'Items', icon: <ItemIcon />, entities: Object.values(items || {}) },
    { title: 'Lore', icon: <LoreIcon />, entities: Object.values(loreEntries || {}) },
  ];

  const visibleSections = allSections.map(section => ({
    ...section,
    entities: filterEntities(section.entities),
  })).filter(section => section.entities.length > 0);

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-stone-700/50">
        <input
          type="text"
          placeholder="Search Codex..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full p-2 rounded-md bg-stone-800 border border-stone-700 text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {visibleSections.map(({ title, icon, entities }) => (
          <AccordionSection
            key={title}
            title={title}
            icon={icon}
            isOpen={openSections.includes(title)}
            onToggle={() => onToggleSection(title)}
          >
            <div className="space-y-2">
              {entities.map((entity: any) => (
                <div
                  key={entity.id}
                  onClick={() => onSelectEntity(entity)}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors duration-150 ${selectedEntityId === entity.id ? 'bg-red-800/50 text-red-200' : 'hover:bg-stone-700/50'}`}>
                  <span>{entity.name || entity.title}</span>
                  <button onClick={(e) => { e.stopPropagation(); onToggleActiveEntity(entity.id); }} className={`p-1 rounded-full ${activeEntityIds.includes(entity.id) ? 'bg-green-500/50 text-green-200' : 'bg-stone-600/50 text-stone-400'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </AccordionSection>
        ))}
      </div>
    </div>
  );
};

export default Codex;
