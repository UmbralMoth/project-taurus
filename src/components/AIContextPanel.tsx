"use client";

const AIContextPanel = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-stone-200">AI Model Context</h3>
      <div className="p-4 bg-stone-800/50 rounded-md">
        <h4 className="text-md font-semibold text-stone-200 mb-2">Assistant Notes</h4>
        <p className="text-stone-400 text-sm">Manage non-diegetic notes and instructions for the AI here. These notes guide the AI's behavior without becoming part of the narrative.</p>
        <ul className="list-disc list-inside text-stone-400 text-sm mt-2">
          <li>Note 1: AI should prioritize character consistency.</li>
          <li>Note 2: Keep narrative tone adventurous.</li>
        </ul>
        <button className="mt-3 px-3 py-1 bg-red-700 hover:bg-red-800 rounded-md text-stone-100 text-sm">Add New Note</button>
      </div>

      <div className="p-4 bg-stone-800/50 rounded-md">
        <h4 className="text-md font-semibold text-stone-200 mb-2">AI Context Settings</h4>
        <p className="text-stone-400 text-sm">Configure how much world data and recent narrative is sent to the AI for context generation.</p>
        <div className="mt-2">
          <label htmlFor="context-depth" className="block text-stone-300 text-sm mb-1">Narrative Context Depth:</label>
          <input type="range" id="context-depth" min="1" max="10" value="5" className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer" />
          <span className="text-stone-400 text-xs">5 recent beats</span>
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

export default AIContextPanel;
