# Project Taurus: AI-Assisted Storywriting and World Simulation

This document summarizes the ongoing development of Project Taurus, a Svelte application designed to facilitate co-operative story writing and immersive character roleplaying with AI assistance.

## Project Goal

The primary goal is to create a UI tool that acts as an "endless immersive game," allowing users to:

- Co-write stories with Gemini.
- Roleplay a character in an immersive way, with AI interpreting user input and extrapolating authentic character actions and dialogue.
- Maintain narrative consistency through structured world state management.

## Core Principles

- **Diegetic vs. Non-Diegetic Information:** A clear distinction is maintained between in-world facts (diegetic) and meta-narrative guidance/notes (non-diegetic) to ensure AI generates authentic, in-context content. For narrative generation, Gemini is instructed to output only narrative text or tool calls, leveraging the Gemini SDK's structured output to differentiate content types. Meta-narrative interactions are handled in a separate "Assistant Mode" chat window.
- **Consistency through Ground Truth:** The application tracks detailed states of objects within the narrative world to maintain consistency, with Gemini managing this "ground truth." This includes precise details for characters (e.g., physical appearance, stats, current state, inventory) and time tracking.
- **Contextual Simulation:** To manage complexity, the "living world" simulation focuses on "active entities" that are relevant and should be simulated by Gemini's initiative.
- **User Verification Loop:** Designed to be contextual, visual, and configurable, allowing users to review and approve AI-proposed `WorldState` changes and narrative generations. Includes visual diffing, quick accept options, configurable granularity, and undo/redo functionality.

## Application Modes

The application supports three distinct modes, each catering to a different user interaction style:

1. **Architect Mode:**

    - **Purpose:** Purely a world simulation sandbox ("god-mode").
    - **Interaction:** User provides commands or natural language instructions, and AI executes them to make things happen in the world.

2. **Writer Mode:**

    - **Purpose:** Focuses on narrative co-writing.
    - **Interaction:** AI is prompted to continue the narrative based on user input or to continue independently if no new input is provided. Users can edit the output narrative and provide input for co-writing without controlling a specific character.

3. **Character Mode:**
    - **Purpose:** Immersive character roleplaying.
    - **Interaction:** Relies primarily on user inputs for their controlled character, which are then extrapolated by AI to generate detailed actions and dialogue for both the Player Character and NPCs.

## Design Aesthetic and Guidelines

Project Taurus will feature a clean, modern, and highly adaptable user interface built with Svelte and TypeScript. The design will follow Material Design 3 principles.

### Aesthetic & Design Guidelines

1. **Clean, Minimalist Material 3 Aesthetic (Dark Theme):**

    - **Color Palette:** Strict adherence to Material 3's dynamic color system principles for a dark theme.
    - **Typography:** Use a clear, readable sans-serif font with a consistent typographic scale.
    - **Elevation & Shadows:** Employ subtle, consistent shadows to indicate hierarchy.
    - **Shape:** Utilize Material 3's rounded corners for components.

2. **Prioritize Clarity and Information Hierarchy:**

    - **Whitespace:** Generous use of whitespace to separate elements and improve readability.
    - **Contrast:** Ensure sufficient contrast between text and background for accessibility.
    - **Visual Grouping:** Use cards, dividers, and consistent spacing to group related information.

3. **Smooth, Purposeful Animations for Focus Changes:**

    - **Transitions:** Use subtle animations to guide the user's eye during panel transformations and focus changes.
    - **Responsiveness:** Animations must remain fluid and performant.

4. **Internal Custom Component Library:**

    - **Modularity:** Design reusable Svelte components for common UI elements (buttons, text inputs, scrollable lists, cards).
    - **Consistency:** Ensure all instances of a component look and behave identically unless explicitly styled differently.

5. **Focus on Functionality and Data Presentation:**
    - **Direct Manipulation:** Enable direct interaction with data where feasible (e.g., inline editing).
    - **Clear Feedback:** Provide immediate visual feedback for user actions and Gemini's responses (e.g., loading indicators, success/error messages).

## Core Data Models (TypeScript Interfaces for JSON Serialization)

The application's data is structured around several key TypeScript interfaces, designed for JSON serialization:

#### 1. `WorldState` (Diegetic Ground Truth)

```typescript
// WorldState represents the current factual state of the narrative world.
// It is the single source of truth for all diegetic information at a given point in time.
interface WorldState {
  currentWorldTime: string; // ISO 8601 format
  currentEra: string;
  globalConditions: { [key: string]: any };
  characters: { [key: string]: Character };
  loreEntries: { [key: string]: LoreEntry };
  items: { [key: string]: Item };
  locations: { [key: string]: Location };
  // ActiveEntities is a transient field used by the application to determine what subset of the WorldState
  // to include in the PromptContext for Gemini. It is NOT part of the persistent WorldState snapshot.
  activeEntities?: string[];
}
```

#### 2. `Character`

```typescript
interface Character {
  id: string;
  name: string;
  description: string;
  backstorySummary: string;
  personalityTraits: string[];
  goals: string[];
  fearsAndWeaknesses: string[];
  beliefsAndValues: string[];
  voiceAndMannerisms: string;
  sexualHistorySummary: string;
  sexualBoundaries: string[];
  attributes: CharacterAttributes;
  state: CharacterState;
  inventory: Item[];
  relationships: { [key: string]: string };
  currentLocationID: string;
  lastAction: string;
  motivation: string;
}

// CharacterAttributes defines physical and inherent traits of a character.
interface CharacterAttributes {
  species: string;
  gender: string;
  age: number;
  physical: PhysicalDetails;
  skillsAndProficiencies: { [key: string]: string };
  stats: { [key: string]: string };
  distinguishingFeatures: string[];
  sexual: SexualDetails;
}

// PhysicalDetails groups physical and explicit appearance attributes.
interface PhysicalDetails {
  physicalAppearance: { [key: string]: string };
  bodyType: string;
  breastSize?: string;
  genitalDescription?: string;
  pubicHair?: string;
  armpitHair?: string;
  legHair?: string;
  chestHair?: string;
}

// SexualDetails groups sexual orientation, preferences, and interests.
interface SexualDetails {
  sexualOrientation: string;
  romanticSexualPreferences: string[];
  kinks: string[];
  sexualInterests: string[];
}

// CharacterState defines the current conditions and emotional state of a character.
interface CharacterState {
  hunger: number;
  thirst: number;
  exhaustion: number;
  afflictions: string[];
  wounds: string[];
  currentEmotionalState: string;
  health: number;
  energy: number;
  mentalState: string;
  statusEffects: string[];
}
```

#### 3. `LoreEntry`

```typescript
// LoreEntry represents an encyclopedic entry about the world.
interface LoreEntry {
  id: string;
  title: string;
  type: string;
  description: string;
  relatedLore: string[];
  tags: string[];
}
```

#### 4. `Location`

```typescript
// Location represents a physical space in the world.
interface Location {
  id: string;
  name: string;
  description: string;
  type: string;
  parentID?: string;
  childIDs?: string[];
  occupantIDs?: string[];
  properties: { [key: string]: any };
  status?: string;
  loreEntryID?: string;
}
```

#### 5. `Item`

```typescript
// Item represents an object within the world.
interface Item {
  id: string;
  name: string;
  description: string;
  type: string;
  quantity: number;
  properties: { [key: string]: any };
  locationID: string;
  ownerID?: string;
  condition: string;
  status?: string;
  relatedLore?: string[];
}
```

#### 6. `Event`

```typescript
// Event represents a narrative beat or a significant occurrence in the world.
interface Event {
  id: string;
  title: string;
  type: string;
  description: string;
  timestamp: string; // ISO 8601 format
  participants: string[];
  locationIDs?: string[];
  affectedEntityIDs?: { [key: string]: string[] };
  relatedLore: string[];
  impact?: string;
  tone?: string;
  worldStateSnapshotPath: string;
  isBranchPoint: boolean;
  retconOfEventID?: string;
}
```

#### 7. `Timeline`

```typescript
// Timeline manages the graph of events and narrative branches.
interface Timeline {
  events: { [key: string]: Event };
  rootEventIDs: string[];
  currentBranchID: string;
  currentEventID: string;
  branches: { [key: string]: Branch };
}

// Branch represents a narrative branch within the timeline.
interface Branch {
  id: string;
  name: string;
  startEventID: string;
  endEventID: string;
  eventOrder: string[];
  parentBranchID?: string;
}
```

#### 8. `NarrativeBeat`

```typescript
// NarrativeBeat represents a single unit of narrative text.
interface NarrativeBeat {
  id: string;
  text: string;
  timestamp: string; // ISO 8601 format
  source: "user" | "gemini";
  eventID: string;
}
```

#### 9. `NarrativeContext`

```typescript
// NarrativeContext represents the sequence of narrative beats forming the current story.
interface NarrativeContext {
  beats: NarrativeBeat[];
}
```

#### 10. `AssistantNote`

```typescript
// AssistantNote represents a non-diegetic note or instruction for the AI.
interface AssistantNote {
  id: string;
  content: string;
  timestamp: string; // ISO 8601 format
  category: string;
  targetIDs?: string[];
}
```

#### 11. `PromptContext`

```typescript
// PromptContext is a curated subset of world data and narrative for Gemini.
interface PromptContext {
  currentWorldState: WorldState;
  recentNarrative: NarrativeBeat[];
  relevantLore: LoreEntry[];
  assistantGuidance: AssistantNote[];
  userPrompt: string;
  mode: "Architect" | "Writer" | "Character";
}
```

## Technical Implementation Details

-   **Framework:** SvelteKit
-   **Language:** TypeScript
-   **Design System:** Material 3 (dark theme)
-   **Local Storage:** All world data is stored locally in `world_data.json`.
-   **State Management:** Svelte's built-in stores and reactivity will be used for state management.
-   **Gemini Integration:** All interactions with the Gemini API will be handled via the official **Google Generative AI SDK for Node.js** (`@google/genai`).

## Gemini Integration (JavaScript/TypeScript Gemini SDK)

All interactions with the Gemini API will be handled via the official **Google Generative AI SDK** (`@google/genai`). This approach simplifies API interaction, handles authentication, and provides structured request/response objects.

### Tool Functions for Gemini Interaction:

Here are the proposed tool functions Gemini can call, designed to be granular and explicit:

1.  **`update_entity(entity_type: string, entity_id: string, updates: object): void`**
2.  **`create_character(character: Character): string`**
3.  **`create_item(item: Item): string`**
4.  **`create_lore_entry(lore_entry: LoreEntry): string`**
5.  **`create_location(location: Location): string`**
6.  **`remove_entity(entity_type: string, entity_id: string): void`**
7.  **`set_active_entities(entity_ids: string[]): void`**
8.  **`advance_world_time(duration_in_minutes: number): void`**
9.  **`record_event(event_data: Event): void`**
10. **`query_world_data(query_type: string, query_params: object): object`**

## Next Steps

The foundational elements for world state, data models, and timeline management are now in place. Future development will focus on:
-   Building out the UI for CRUD operations on `Character`, `LoreEntry`, `Item`, and `Event` data.
-   Developing the interactive Center Panel for narrative input/output.
-   Implementing the Right Panel for contextual and non-diegetic information.
-   Integrating AI interaction workflows for each mode.