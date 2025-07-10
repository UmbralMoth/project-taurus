import { NextResponse } from 'next/server';
import { readWorldState, writeWorldState } from '@/lib/worldState';

export async function GET() {
  try {
    const worldState = await readWorldState();
    return NextResponse.json(worldState);
  } catch (error) {
    console.error('Error reading world state:', error);
    return NextResponse.json({ error: 'Failed to read world state' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const worldState = await request.json();
    await writeWorldState(worldState);
    return NextResponse.json({ message: 'World state updated successfully' });
  } catch (error) {
    console.error('Error writing world state:', error);
    return NextResponse.json({ error: 'Failed to write world state' }, { status: 500 });
  }
}
