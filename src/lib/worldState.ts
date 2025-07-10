import { promises as fs } from 'fs';
import path from 'path';
import { WorldState } from '@/types';

const WORLD_DATA_PATH = path.join(process.cwd(), 'world_data.json');

export async function readWorldState(): Promise<WorldState | null> {
  try {
    const fileContents = await fs.readFile(WORLD_DATA_PATH, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      console.warn('world_data.json not found. A new one will be created on first write.');
      return null;
    }
    throw error;
  }
}

export async function writeWorldState(worldState: WorldState): Promise<void> {
  await fs.writeFile(WORLD_DATA_PATH, JSON.stringify(worldState, null, 2), 'utf8');
}
