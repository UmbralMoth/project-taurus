"use client";

import { useStory } from "@/context/StoryContext";
import { useState } from "react";

const SettingsPanel = () => {
  const { story, updateStory } = useStory();
  const [theme, setTheme] = useState('Ink & Parchment (Dark)');

  const handleExportStory = async () => {
    if (!story) {
      alert('No story data to export.');
      return;
    }
    try {
      const result = await window.electron.ipcRenderer.invoke('export-story', story);
      if (result.success) {
        alert('Story exported successfully!');
      } else {
        alert(`Failed to export story: ${result.error}`);
      }
    } catch (error) {
      console.error('Error exporting story:', error);
      alert('An error occurred during export.');
    }
  };

  const handleImportStory = async () => {
    try {
      const result = await window.electron.ipcRenderer.invoke('import-story');
      if (result.success && result.storyData) {
        await updateStory(result.storyData);
        alert('Story imported successfully!');
      } else if (result.error) {
        alert(`Failed to import story: ${result.error}`);
      } else {
        alert('Import cancelled or no data selected.');
      }
    } catch (error) {
      console.error('Error importing story:', error);
      alert('An error occurred during import.');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-stone-200">Application Settings</h3>
      <div className="p-4 bg-stone-800/50 rounded-md">
        <h4 className="text-md font-semibold text-stone-200 mb-2">Theme Settings</h4>
        <p className="text-stone-400 text-sm">Customize the visual theme of the application.</p>
        <div className="mt-2">
          <label htmlFor="theme-select" className="block text-stone-300 text-sm mb-1">Select Theme:</label>
          <select 
            id="theme-select" 
            className="w-full p-2 rounded-md bg-stone-700/50 border border-stone-600/50 text-stone-200 text-sm focus:outline-none focus:border-red-500"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option>Ink & Parchment (Dark)</option>
            <option>Classic (Light)</option>
          </select>
        </div>
      </div>

      <div className="p-4 bg-stone-800/50 rounded-md">
        <h4 className="text-md font-semibold text-stone-200 mb-2">Data Management</h4>
        <p className="text-stone-400 text-sm">Options for managing your story data.</p>
        <div className="mt-2 space-y-2">
          <button 
            onClick={handleExportStory}
            className="w-full px-3 py-2 bg-red-700 hover:bg-red-800 rounded-md text-stone-100 text-sm"
          >
            Export Story Data
          </button>
          <button 
            onClick={handleImportStory}
            className="w-full px-3 py-2 bg-red-700 hover:bg-red-800 rounded-md text-stone-100 text-sm"
          >
            Import Story Data
          </button>
          <button className="w-full px-3 py-2 bg-red-700 hover:bg-red-800 rounded-md text-stone-100 text-sm">Clear All Data (Caution!)</button>
        </div>
      </div>

      <div className="p-4 bg-stone-800/50 rounded-md">
        <h4 className="text-md font-semibold text-stone-200 mb-2">About</h4>
        <p className="text-stone-400 text-sm">Project Taurus - Version 0.1.0</p>
        <p className="text-stone-400 text-sm">Developed by Gemini AI</p>
      </div>
    </div>
  );
};

export default SettingsPanel;
