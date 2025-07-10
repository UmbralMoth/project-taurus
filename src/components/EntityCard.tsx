"use client";

import { Character, Location, Item, LoreEntry } from '@/types';

interface EntityCardProps {
  entity: Character | Location | Item | LoreEntry;
  onSelect: (entity: any) => void;
  isSelected: boolean;
}

const EntityCard = ({ entity, onSelect, isSelected }: EntityCardProps) => {
  const baseStyle = "w-full p-3 rounded-lg cursor-pointer transition-all duration-200 border relative overflow-hidden";
  const selectedStyle = "bg-red-900/50 border-red-700/80 shadow-lg";
  const unselectedStyle = "bg-stone-800/50 border-stone-700/50 hover:bg-stone-700/50 hover:border-stone-600";

  return (
    <div 
      onClick={() => onSelect(entity)}
      className={`${baseStyle} ${isSelected ? selectedStyle : unselectedStyle}`}
    >
      {/* The main content of the card */}
      <h3 className="font-semibold text-stone-100 truncate pr-8">{entity.name || (entity as LoreEntry).title}</h3>
      
      {/* The ID Pill */}
      <div className="absolute top-0 right-0 px-2 py-0.5 bg-stone-700/80 rounded-bl-lg z-10">
        <span className="text-xs font-mono text-stone-400">#{entity.id}</span>
      </div>
    </div>
  );
};

export default EntityCard;