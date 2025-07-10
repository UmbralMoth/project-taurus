"use client";

import React, { useState, useMemo } from 'react';
import { Tree, NodeRendererProps } from 'react-arborist';
import { WorldState, Character, Location, Item, LoreEntry } from '@/types';
import { CharacterIcon, LocationIcon, ItemIcon, LoreIcon, ChevronIcon } from './Icons';

// Define the structure for our tree nodes
interface ArboristNode {
  id: string;
  name: string;
  type: 'category' | 'character' | 'location' | 'item' | 'lore';
  children?: ArboristNode[];
  data?: any; // To store original entity data
}

// --- Icon Helper ---
const getIconForEntityType = (type: string) => {
  switch (type) {
    case 'character':
    case 'characters':
      return <CharacterIcon />;
    case 'location':
    case 'locations':
      return <LocationIcon />;
    case 'item':
    case 'items':
      return <ItemIcon />;
    case 'lore':
    case 'loreEntries':
      return <LoreIcon />;
    default:
      return null;
  }
};

// --- Custom Node Renderer for React Arborist ---
const Node = ({ node, style, dragHandle, tree }: NodeRendererProps<ArboristNode>) => {
  const isCategory = node.data.type === 'category';

  return (
    <div
      ref={dragHandle}
      style={style}
      className={`flex items-center cursor-pointer node ${node.state.isSelected ? 'node-selected' : ''}`}
      onClick={() => {
        if (isCategory) {
          node.toggle();
        } else {
          tree.select(node.id);
          if (node.data.data) {
            tree.props.onSelect(node.data.data);
          }
        }
      }}
    >
      {isCategory && (
        <span className="flex items-center" onClick={() => node.toggle()}>
          <ChevronIcon isOpen={node.isOpen} />
        </span>
      )}
      <span className="node-icon">{getIconForEntityType(node.data.type)}</span>
      <span className="node-text">{node.data.name}</span>
      {!isCategory && (
         <span className="node-id-pill">{node.data.id.substring(0, 6)}</span>
      )}
    </div>
  );
};

// --- Main WorldDataTree Component ---
const WorldDataTree = ({ data, onSelectEntity, selectedEntityId }: { data: WorldState | null, onSelectEntity: (entity: any) => void, selectedEntityId: string | null }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const treeData = useMemo(() => {
    if (!data || !data.worldState) return [];

    const worldState = data.worldState;
    const rootNodes: ArboristNode[] = [];
    const categories: { [key: string]: ArboristNode } = {
      characters: { id: 'cat-characters', name: 'Characters', type: 'category', children: [] },
      locations: { id: 'cat-locations', name: 'Locations', type: 'category', children: [] },
      items: { id: 'cat-items', name: 'Items', type: 'category', children: [] },
      loreEntries: { id: 'cat-lore', name: 'Lore', type: 'category', children: [] },
    };

    const processEntity = (entity: any, type: 'character' | 'location' | 'item' | 'lore', categoryKey: string) => {
      const name = entity.name || (entity as LoreEntry).title || 'Unnamed';
      if (searchTerm && !name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return; // Skip if it doesn't match search term
      }
      categories[categoryKey].children?.push({
        id: entity.id,
        name,
        type,
        data: entity,
      });
    };

    if (filterType === 'all' || filterType === 'characters') {
      Object.values(worldState.characters || {}).forEach(c => processEntity(c, 'character', 'characters'));
    }
    if (filterType === 'all' || filterType === 'locations') {
      Object.values(worldState.locations || {}).forEach(l => processEntity(l, 'location', 'locations'));
    }
    if (filterType === 'all' || filterType === 'items') {
      Object.values(worldState.items || {}).forEach(i => processEntity(i, 'item', 'items'));
    }
    if (filterType === 'all' || filterType === 'loreEntries') {
      Object.values(worldState.loreEntries || {}).forEach(le => processEntity(le, 'lore', 'loreEntries'));
    }

    // Only add categories that have children
    Object.values(categories).forEach(cat => {
      if (cat.children && cat.children.length > 0) {
        rootNodes.push(cat);
      }
    });

    return rootNodes;
  }, [data, searchTerm, filterType]);

  return (
    <div className="flex flex-col h-full">
      {/* Search and Filter Bar */}
      <div className="flex-shrink-0 mb-4 space-y-2">
        <input
          type="text"
          placeholder="Search entities..."
          className="w-full p-2 rounded-md bg-stone-800 border border-stone-700 text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-red-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="w-full p-2 rounded-md bg-stone-800 border border-stone-700 text-stone-200 focus:outline-none focus:ring-1 focus:ring-red-500"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="characters">Characters</option>
          <option value="locations">Locations</option>
          <option value="items">Items</option>
          <option value="loreEntries">Lore</option>
        </select>
      </div>

      {/* Tree View */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 tree-view">
        <Tree
          data={treeData}
          openByDefault={true}
          width="100%"
          height={1000} // Adjust height as needed or use a container with a specific height
          indent={24}
          rowHeight={36}
          onSelect={(nodes) => {
            // Assuming single selection, take the first selected node
            if (nodes.length > 0 && nodes[0].data.data) {
              onSelectEntity(nodes[0].data.data);
            }
          }}
          selection={selectedEntityId}
        >
          {Node}
        </Tree>
      </div>
    </div>
  );
};

export default WorldDataTree;