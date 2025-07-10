"use client";

import { useState } from 'react';

const WorldPanel = () => {
  const [contextDepth, setContextDepth] = useState(5);

  return (
    <div className="space-y-4">
      <div className="p-4 bg-stone-800/50 rounded-md">
        <h4 className="text-md font-semibold text-stone-200 mb-2">AI Context Settings</h4>
        <p className="text-stone-400 text-sm">Configure how much world data and recent narrative is sent to the AI for context generation.</p>
        <div className="mt-2">
          <label htmlFor="context-depth" className="block text-stone-300 text-sm mb-1">Narrative Context Depth:</label>
          <input 
            type="range" 
            id="context-depth" 
            min="1" 
            max="10" 
            value={contextDepth} 
            onChange={(e) => setContextDepth(Number(e.target.value))} 
            className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer" 
          />
          <span className="text-stone-400 text-xs">{contextDepth} recent beats</span>
        </div>
        <div className="mt-2">
          <label htmlFor="entity-inclusion" className="block text-stone-300 text-sm mb-1">Entity Inclusion:</label>
          <select id="entity-inclusion" className="w-full p-2 rounded-md bg-stone-700/50 border border-stone-600/50 text-stone-200 text-sm focus:outline-none focus:border-red-500">
            <option>Active Entities Only</option>
            <option>All Relevant Entities</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default WorldPanel;