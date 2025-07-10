"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Story, WorldState, NarrativeBeat } from '@/types';

interface StoryContextType {
  story: Story | null;
  worldState: WorldState | null;
  narrativeBeats: NarrativeBeat[];
  updateStory: (newStory: Story) => Promise<void>;
  addNarrativeBeat: (newBeat: NarrativeBeat) => Promise<void>;
  updateEntity: (updatedEntity: any) => Promise<void>; // Add this line
  loading: boolean;
  error: string | null;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export const StoryProvider = ({ children }: { children: ReactNode }) => {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch('/api/story'); // We will create this API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStory(data);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, []);

  const updateStory = async (newStory: Story) => {
    try {
      setLoading(true);
      const response = await fetch('/api/story', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStory),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setStory(newStory);
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        }
    } finally {
      setLoading(false);
    }
  };

  const addNarrativeBeat = async (newBeat: NarrativeBeat) => {
    if (!story) return;
    const newStory: Story = {
      ...story,
      narrativeContext: {
        ...story.narrativeContext,
        beats: [...story.narrativeContext.beats, newBeat],
      },
    };
    await updateStory(newStory);
  };

  const updateEntity = async (updatedEntity: any) => {
    if (!story || !story.worldState || !updatedEntity || !updatedEntity.id) return;

    const newWorldState = { ...story.worldState };

    // Determine entity type and update accordingly
    if ('species' in updatedEntity) { // Likely a Character
      newWorldState.characters = { ...newWorldState.characters, [updatedEntity.id]: updatedEntity };
    } else if ('parentID' in updatedEntity || 'childIDs' in updatedEntity) { // Likely a Location
      newWorldState.locations = { ...newWorldState.locations, [updatedEntity.id]: updatedEntity };
    } else if ('quantity' in updatedEntity || 'ownerID' in updatedEntity) { // Likely an Item
      newWorldState.items = { ...newWorldState.items, [updatedEntity.id]: updatedEntity };
    } else if ('type' in updatedEntity && ('relatedLore' in updatedEntity || 'tags' in updatedEntity)) { // Likely a LoreEntry
      newWorldState.loreEntries = { ...newWorldState.loreEntries, [updatedEntity.id]: updatedEntity };
    }

    const newStory: Story = {
      ...story,
      worldState: newWorldState,
    };
    await updateStory(newStory);
  };

  return (
    <StoryContext.Provider value={{
      story,
      worldState: story?.worldState || null,
      narrativeBeats: story?.narrativeContext?.beats || [],
      updateStory,
      addNarrativeBeat,
      updateEntity, // Add updateEntity here
      loading,
      error
    }}>
      {children}
    </StoryContext.Provider>
  );
};

export const useStory = () => {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};