// This route is used for generating summary of the audio/voice based on the transcription received from deepgram.
// The API is called by the Voice Transcription component in the frontend where users upload the voice file and get the transcription from deepgram.

import { NextRequest, NextResponse } from 'next/server';
import { OpenAiSummaryStream } from '@/utils/OpenAiSummaryStream';

export async function POST(request: NextRequest) {
  try {
    // Parse JSON body from the request to get transciption
    const { transciption } = await request.json();

    // Call the OpenAI streaming function with the configured payload
    const stream = await OpenAiSummaryStream(transciption);

    // Return the streaming response to the client
    return new Response(stream);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'failed', error: error });
  }
}
