import { NextRequest, NextResponse } from 'next/server';
import { Toolhouse } from '@toolhouse/sdk';

const toolhouse = new Toolhouse({
  apiKey: process.env.TOOLHOUSE_API_KEY,
  metadata: {
    projectId: 'allervie-dashboard',
    environment: process.env.NODE_ENV
  }
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, model = 'claude-3-5-sonnet-latest' } = body;

    const response = await toolhouse.chat.completions.create({
      messages,
      model
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Toolhouse API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Toolhouse API is running' });
}