import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python3', [
        path.join(process.cwd(), 'python_tools', 'toolhouse_chat.py'),
        message
      ]);

      let result = '';
      let error = '';

      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          resolve(NextResponse.json(
            { error: error || 'Process exited with non-zero code' },
            { status: 500 }
          ));
        } else {
          try {
            const parsedResult = JSON.parse(result);
            resolve(NextResponse.json(parsedResult));
          } catch (e) {
            resolve(NextResponse.json(
              { error: 'Failed to parse Python output' },
              { status: 500 }
            ));
          }
        }
      });
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}