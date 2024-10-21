'use client';
import { useState, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { TranscriptionList, AudioRecorder } from '@/components';
import { BotAnswers, ThreadResponse, Transcription } from '@/types';

let botAnswer = '';

export default function Home() {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [threadId, setThreadId] = useState<string>('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const newTranscriptHandler = useCallback((transcript: Transcription, index: number) => {
    let text = '';
    if (transcript.botAnswer) {
      if (botAnswer != BotAnswers.ADS && transcript.botAnswer == BotAnswers.ADS) {
        text = 'Commercial Break Started';
        toast.error(text);
      } else if (botAnswer === BotAnswers.ADS && transcript.botAnswer == BotAnswers.BROADCAST) {
        text = 'Commercial Break Ended';
        toast.info(text);
      }
      botAnswer = transcript.botAnswer;
    }
    setTranscriptions((prevItems) => [
      ...prevItems.slice(0, index),
      { ...transcript, botAnswer: text },
      ...prevItems.slice(index),
    ]);
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
      <div className="flex flex-col min-w-[60%]">
        <h1 className="pb-4 text-lg">Real-time Transcriptions</h1>
        <div className="">
          <TranscriptionList transcriptions={transcriptions} />
        </div>
      </div>
    </div>
  );
}
