"use client";

import { useState, useEffect } from 'react';
import { Character, Location, Item, LoreEntry } from '@/types';
import { ChevronIcon } from './Icons';

type SelectedEntity = Character | Location | Item | LoreEntry | null;

const toTitleCase = (str: string) => {
  return str.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
};

const DetailRow = ({ label, value }: { label: string, value: any }) => {
  if (value === null || value === undefined || value === '') return null;

  let displayValue;
  if (typeof value === 'object') {
    displayValue = <pre className="text-xs whitespace-pre-wrap p-2 bg-stone-900/50 rounded-md">{JSON.stringify(value, null, 2)}</pre>;
  } else {
    displayValue = <span className="text-stone-300">{String(value)}</span>;
  }

  return (
    <div className="mb-2">
      <strong className="text-red-400">{toTitleCase(label)}:</strong> {displayValue}
    </div>
  );
};

const EntityDetailView = ({ entity, onSave, onBack, isMobile }: { entity: SelectedEntity, onSave: (updatedEntity: SelectedEntity) => void, onBack: () => void, isMobile?: boolean }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableEntity, setEditableEntity] = useState<SelectedEntity>(entity);

  useEffect(() => {
    setEditableEntity(entity);
    setIsEditing(false);
  }, [entity]);

  if (!entity) {
    return <div className="text-stone-500">Select an entity from the left panel to view its details.</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditableEntity(prev => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };

  const handleSave = () => {
    if (editableEntity) {
      onSave(editableEntity);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditableEntity(entity);
    setIsEditing(false);
  };

  return (
    <div className="p-1">
      {isMobile && (
        <button onClick={onBack} className="mb-4 flex items-center text-red-400 hover:text-red-500">
          <ChevronIcon isOpen={true} className="rotate-180 mr-2" />
          Back to Codex
        </button>
      )}
      <h3 className="text-xl font-bold mb-4 text-red-400">{entity.name || (entity as LoreEntry).title}</h3>

      {!isEditing ? (
        <div className="mb-4">
          {Object.entries(entity).map(([key, value]) => (
            <DetailRow key={key} label={key} value={value} />
          ))}
          <button 
            onClick={() => setIsEditing(true)}
            className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-800 rounded-md text-stone-100"
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="mb-4 space-y-3">
          {Object.entries(editableEntity || {}).map(([key, value]) => {
            if (typeof value === 'string' || typeof value === 'number') {
              return (
                <div key={key}>
                  <label htmlFor={key} className="block text-stone-300 text-sm mb-1">{toTitleCase(key)}:</label>
                  {key === 'description' || key === 'backstorySummary' || key === 'voiceAndMannerisms' || key === 'motivation' ? (
                    <textarea
                      id={key}
                      name={key}
                      value={String(value)}
                      onChange={handleChange}
                      className="w-full p-2 rounded-md bg-stone-700/50 border border-stone-600/50 text-stone-200 placeholder-stone-400 focus:outline-none focus:border-red-500 h-24"
                    />
                  ) : (
                    <input
                      type="text"
                      id={key}
                      name={key}
                      value={String(value)}
                      onChange={handleChange}
                      className="w-full p-2 rounded-md bg-stone-700/50 border border-stone-600/50 text-stone-200 placeholder-stone-400 focus:outline-none focus:border-red-500"
                    />
                  )}
                </div>
              );
            } else if (Array.isArray(value)) {
                return (
                    <div key={key}>
                        <label htmlFor={key} className="block text-stone-300 text-sm mb-1">{toTitleCase(key)} (comma-separated):</label>
                        <textarea
                            id={key}
                            name={key}
                            value={value.join(', ')}
                            onChange={handleChange}
                            className="w-full p-2 rounded-md bg-stone-700/50 border border-stone-600/50 text-stone-200 placeholder-stone-400 focus:outline-none focus:border-red-500 h-24"
                        />
                    </div>
                );
            } else if (typeof value === 'object' && value !== null) {
              return (
                <div key={key}>
                  <strong className="text-red-400">{toTitleCase(key)}:</strong>
                  <pre className="text-xs whitespace-pre-wrap p-2 bg-stone-900/50 rounded-md">{JSON.stringify(value, null, 2)}</pre>
                </div>
              );
            }
            return null;
          })}
          <div className="flex space-x-2 mt-4">
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-red-700 hover:bg-red-800 rounded-md text-stone-100"
            >
              Save
            </button>
            <button 
              onClick={handleCancel}
              className="px-4 py-2 bg-stone-600 hover:bg-stone-700 rounded-md text-stone-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntityDetailView;