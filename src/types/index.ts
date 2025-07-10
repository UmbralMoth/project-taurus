export interface Story {
  worldState: WorldState;
  narrativeContext: NarrativeContext;
}

export interface WorldState {
  currentWorldTime: string; // ISO 8601 format
  currentEra: string;
  globalConditions: { [key: string]: unknown };
  characters: { [key: string]: Character };
  loreEntries: { [key: string]: LoreEntry };
  items: { [key: string]: Item };
  locations: { [key: string]: Location };
  activeEntities?: string[];
}

export interface Character {
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

export interface CharacterAttributes {
  species: string;
  gender: string;
  age: number;
  physical: PhysicalDetails;
  skillsAndProficiencies: { [key: string]: string };
  stats: { [key: string]: string };
  distinguishingFeatures: string[];
  sexual: SexualDetails;
}

export interface PhysicalDetails {
  physicalAppearance: { [key: string]: string };
  bodyType: string;
  breastSize?: string;
  genitalDescription?: string;
  pubicHair?: string;
  armpitHair?: string;
  legHair?: string;
  chestHair?: string;
}

export interface SexualDetails {
  sexualOrientation: string;
  romanticSexualPreferences: string[];
  kinks: string[];
  sexualInterests: string[];
}

export interface CharacterState {
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

export interface LoreEntry {
  id: string;
  title: string;
  type: string;
  description: string;
  relatedLore: string[];
  tags: string[];
}

export interface Location {
  id: string;
  name: string;
  description: string;
  type: string;
  parentID?: string;
  childIDs?: string[];
  occupantIDs?: string[];
  properties: { [key: string]: unknown };
  status?: string;
  loreEntryID?: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: string;
  quantity: number;
  properties: { [key: string]: unknown };
  locationID: string;
  ownerID?: string;
  condition: string;
  status?: string;
  relatedLore?: string[];
}

export interface Event {
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

export interface Timeline {
  events: { [key: string]: Event };
  rootEventIDs: string[];
  currentBranchID: string;
  currentEventID: string;
  branches: { [key: string]: Branch };
}

export interface Branch {
  id: string;
  name: string;
  startEventID: string;
  endEventID: string;
  eventOrder: string[];
  parentBranchID?: string;
}

export interface NarrativeBeat {
  id: string;
  text: string;
  timestamp: string; // ISO 8601 format
  source: "user" | "gemini";
  eventID: string;
}

export interface NarrativeContext {
  beats: NarrativeBeat[];
}

export interface AssistantNote {
  id: string;
  content: string;
  timestamp: string; // ISO 8601 format
  category: string;
  targetIDs?: string[];
}

export interface PromptContext {
  currentWorldState: WorldState;
  recentNarrative: NarrativeBeat[];
  relevantLore: LoreEntry[];
  assistantGuidance: AssistantNote[];
  userPrompt: string;
  mode: "Architect" | "Writer" | "Character";
}
