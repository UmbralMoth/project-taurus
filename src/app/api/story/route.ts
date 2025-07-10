import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const STORY_DATA_PATH = path.join(process.cwd(), 'world_data.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(STORY_DATA_PATH, 'utf8');
    const story = JSON.parse(fileContents);
    return NextResponse.json(story);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return new NextResponse('Story data not found.', { status: 404 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await fs.writeFile(STORY_DATA_PATH, JSON.stringify(body, null, 2), 'utf8');
    return new NextResponse('Story updated successfully.', { status: 200 });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
