'use client';

import { generateTranscriptionFn, saveSummary, uploadAudioFile } from '@/app/(dashboard)/home/actions';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { cn, errorToast, formatTime } from '@/utils/utils';
import { ChangeEvent, FC, use, useCallback, useEffect, useState } from 'react';
import ModalOutput from '@/components/dashboard/generate/ModalOutput';
import { LiveAudioVisualizer } from 'react-audio-visualize';
import { Button, buttonVariants } from '@/components/ui/button';
import { FaSquare } from 'react-icons/fa';
import { AiOutlineAudio } from 'react-icons/ai';
import { FiUpload } from 'react-icons/fi';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import { BiLoaderAlt } from 'react-icons/bi';

interface GenerateTranscriptionProps {}

type TypeOutputContent = { transcription: string; summary?: string; created_at?: string };

const GenerateTranscription: FC<GenerateTranscriptionProps> = () => {
  const supabase = supabaseBrowserClient();

  const [isPending, setIsPending] = useState<boolean>(false);
  const [content, setContent] = useState<TypeOutputContent>();
  const [transcriptionId, setTranscriptionId] = useState<string>();
  const [audioUrl, setAudioUrl] = useState<string>();
  const [status, setStatus] = useState<string>('Audio is being uploaded');
  const [hasHandled, setHasHandled] = useState(false);
  const [stateDB, setStateDB] = useState<string>('empty');

  const { startRecording, stopRecording, mediaRecorder, isRecording, recordingTime, recordingBlob } =
    useAudioRecorder();

  // Handle the input audio file and set the value to the state
  const handleFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // Check if the file size is within the limit.
    // 4.5mb is the maximum file size allowed by Vercel to be handled by the edge/lambda functions
    const fileLimit = 4.5 * 1000 * 1000; //  4.5mb
    if (file && file?.size > fileLimit) {
      errorToast('File size limit Exceeded');
      return;
    }

    handleGeneration(file);
  };

  // Start the process of generating the transcription
  const handleGeneration = async (blob?: Blob | File) => {
    setIsPending(true);

    try {
      if (!blob) {
        throw 'Please select or record and audio';
      }

      const data = new FormData();
      data.append('audio', blob, 'audio.mp3');

      // First upload the audio file to the supabase storage and get the public url
      const audioUrl = await uploadAudioFile(data);
      if (audioUrl == null) {
        throw 'Failed to upload your file. Please try again.';
      }
      setAudioUrl(audioUrl);
      console.log('AUDIO URL:', audioUrl);
      console.log('File uploaded successfully');

      setStatus('File uploaded successfully');

      setStatus('Getting your transcription ready');
      setTranscriptionId('newID');
      setStatus('Getting your transcription ready');

    } catch (error) {
      errorToast(`${error}`);
      setIsPending(false);
    }
  };

  const handleRecordInserted = (payload: any) => {
    console.log('inside handleRecordInserted');
    if (payload.new) {
      console.log('New record inserted:', payload.new);
      // Handle the inserted record
      setStateDB('insert');
    }
  };

  const handleRecordUpdated = (payload: any) => {
    console.log('inside handleRecordUpdated');
    if (payload.new) {
      console.log('Record updated:', payload.new);
      // Handle the updated record
      //setContent
      setContent((prevContent) => ({
        transcription: payload.new.transcription,
        summary: payload.new.summary,
        created_at: payload.new.created_at,
      }));
      setStateDB('update');
      setIsPending(false);
    }
  };

  async function fetchVoiceTranscriptions(audioUrl: string, apiKey: string) {
    // Construct the encoded URL
    const baseUrl = 'https://qweybwlsnjkgrabqdeov.supabase.co/rest/v1/voice_transcriptions';
    const queryParams = `?select=*&audio_url=eq.${encodeURIComponent(audioUrl)}`;
    const requestUrl = `${baseUrl}${queryParams}`;

    try {
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          apikey: apiKey, // Your Supabase anonpublic API key
          Authorization: `Bearer ${apiKey}`, // Auth header with API key
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Voice Transcriptions inside FETCH VOICE TRANS FUNCTION:', data);
      return data;
    } catch (error) {
      console.error('Error fetching voice transcriptions:', error);
      throw error;
    }
  }

  useEffect(() => {
    console.log('INDISE USE EFFECT');

    const channel = supabase
      .channel('value-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'voice_transcriptions' },
        handleRecordInserted
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'voice_transcriptions' },
        handleRecordUpdated
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    return () => {};
  }, [stateDB, supabase]);

  // Polling function to check for updates
  const pollForUpdates = async (audioUrl: string) => {
    console.log('POLL UPDATES URL:', audioUrl);
    try {
      const { data, error } = await supabase
        .from('voice_transcriptions')
        .select('*')
        .eq('audio_url', audioUrl)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        if (data.error) {
          errorToast(data.error);
        } else {
          console.log('GOT the data');
          console.log('DATA:', data);
        }
      }
    } catch (error) {
      console.error('Error polling for updates:', error);
    }

    return false; // Continue polling
  };

  // Start polling for updates
  const startPolling = (audioUrl: string) => {
    const interval = setInterval(async () => {
      console.log('Polling check');
      const stopPolling = await pollForUpdates(audioUrl);
      if (stopPolling) {
        clearInterval(interval);
      }
    }, 3000);
  };

  function convertUrlFormat(inputUrl: string) {
    // Split the URL into base and path components
    const base_url = inputUrl.split('/storage/v1/object/public/')[0];
    const path_url = '/storage/v1/object/public/' + inputUrl.split('/storage/v1/object/public/')[1];

    // Construct the formatted URL
    const formatted_url = `${base_url}\r\n${path_url}`;

    return formatted_url;
  }

  // Memoize handleRecording with an extra step to control repetitive calls.
  const stableHandleRecording = useCallback(
    async (blob: Blob) => {
      if (hasHandled) return; // Prevent re-handling if already done
      setHasHandled(true);
      await handleGeneration(blob);
    },
    [hasHandled]
  );

  useEffect(() => {
    if (recordingBlob && !hasHandled) {
      stableHandleRecording(recordingBlob);
    }
  }, [recordingBlob, stableHandleRecording, hasHandled]);

  return (
    <>
      <div className='rounded-2xl p-4 border space-y-5 w-full sm:min-w-[392px]'>
        <div className='text-subtle text-sm font-semibold mx-auto rounded-lg bg-border/50 py-1 px-4 w-fit'>
          Record Audio
        </div>
        <div className='bg-border/50 rounded-lg border px-2 py-3 h-28 flex items-center justify-center flex-col'>
          {isPending ? (
            <div className='flex flex-col justify-center items-center'>
              <BiLoaderAlt className='text-destructive size-6 mb-4 text-center animate-spin' />
              <p className='text-destructive font-semibold text-sm'>{status}</p>
            </div>
          ) : (
            <>
              {isRecording ? (
                <div className='text-red-600'>
                  {mediaRecorder && (
                    <LiveAudioVisualizer
                      mediaRecorder={mediaRecorder}
                      width={330}
                      height={50}
                      barWidth={3}
                      gap={4}
                      fftSize={512}
                      maxDecibels={-10}
                      minDecibels={-80}
                      smoothingTimeConstant={0.8}
                    />
                  )}
                </div>
              ) : (
                <div className='border-2 w-full' />
              )}
            </>
          )}
        </div>

        {/* Show audio duration */}
        <div className={cn(isPending && 'text-subtle', 'text-default text-[40px] font-bold text-center')}>
          {formatTime(recordingTime)}
        </div>

        {isPending ? (
          <Button variant='outline' className='text-subtle/30 text-sm font-medium w-full cursor-wait'>
            Uploading audio
          </Button>
        ) : isRecording ? (
          // End audio recording button
          <Button
            variant='destructive'
            onClick={() => stopRecording()}
            className='w-full rounded-lg gap-1.5 red-btn-gradient text-white'>
            <FaSquare />
            End Recording
          </Button>
        ) : (
          <div className='block sm:flex gap-1.5' aria-disabled>
            {/* Button to record audio */}
            <Button
              variant='destructive'
              onClick={() => startRecording()}
              className='w-full rounded-lg px-7 mb-2 sm:mb-0 red-btn-gradient text-white'>
              <AiOutlineAudio className='size-4' />
              Record Audio
            </Button>

            {/* Button to upload an audio file */}
            <label
              htmlFor='audioInput'
              className={cn(buttonVariants({ variant: 'outline' }), 'w-full cursor-pointer rounded-lg px-7')}>
              <FiUpload className='size-4 mr-1.5' /> Upload Audio
            </label>
            <input
              type='file'
              name='audio'
              id='audioInput'
              accept='.mp3, .mp4, .webm'
              className='hidden'
              onChange={handleFileInput}
            />
          </div>
        )}
      </div>

      {content && (
        <ModalOutput
          transcription={content.transcription ?? ''}
          summary={content.summary ?? ''}
          audio_url={audioUrl ?? ''}
          defualtOpen
        />
      )}
    </>
  );
};

export default GenerateTranscription;
