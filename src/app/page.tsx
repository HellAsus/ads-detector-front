'use client';
import { useState, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { TranscriptionList, AudioRecorder } from '@/components';
import { BotAnswers, ThreadResponse, Transcriptions } from '@/types';

let botAnswer = '';

export default function Home() {
  const [transcriptions, setTranscriptions] = useState<Transcriptions[]>([]);
  const [threadId, setThreadId] = useState<string>('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const newTranscriptHandler = useCallback((transcript: Transcriptions) => {
    if (transcript.botAnswer) {
      if (botAnswer != BotAnswers.ADS && transcript.botAnswer == BotAnswers.ADS) {
        toast.error('ADs Started');
      }
      botAnswer = transcript.botAnswer;
    }
    setTranscriptions((prevItems) => [...prevItems, transcript]);
  }, []);

  const startRecordingHandler = useCallback(async () => {
    await getThreadId();
    setTranscriptions([]);
  }, []);

  const stopRecordingHandler = useCallback(async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const getThreadId = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/createThread`, {
        method: 'GET',
      });
      const result: ThreadResponse = await response.json();
      if (result.threadId) {
        setThreadId(result.threadId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full h-full flex-col items-center pt-20">
      <div className="pb-10">
        <AudioRecorder
          threadId={threadId}
          onNewTranscript={newTranscriptHandler}
          onStartRecording={startRecordingHandler}
          onStopRecording={stopRecordingHandler}
        />
      </div>
      <div className="flex flex-col min-w-[50%]">
        <h1 className="pb-4 text-lg">Transcriptions</h1>
        <div className="border-2 rounded-md p-4">
          <TranscriptionList transcriptions={transcriptions} />
        </div>
      </div>
    </div>
  );
}
