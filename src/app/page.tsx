'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { TranscriptionList, AudioRecorder } from '@/components';
import { BotResponse, BotAnswers, ThreadResponse } from '@/types';

let botAnswer = '';

export default function Home() {
  const [transcriptions, setTranscriptions] = useState<string[]>([]);
  const [threadId, setThreadId] = useState<string>('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [askLoop, setAskLoop] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const newTranscriptHandler = useCallback((transcript: string) => {
    setTranscriptions((prevItems) => [...prevItems, transcript]);
  }, []);

  const startRecordingHandler = useCallback(async () => {
    await getThreadId();
    setTranscriptions([]);
    intervalRef.current = setInterval(async () => {
      setAskLoop(Date.now());
    }, 1000);
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

  const askAssistant = async ({ question, threadId }: { question: string; threadId: string }) => {
    const formData = new FormData();
    formData.append('question', question);
    formData.append('threadId', threadId);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/askAssistant`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) return false;

    const result: BotResponse = await response.json();
    if (result.botAnswer) {
      if (botAnswer != BotAnswers.ADS && result.botAnswer == BotAnswers.ADS) {
        toast.error('ADs Started');
      }
      botAnswer = result.botAnswer;
      return true;
    }
    return false;
  };

  useEffect(() => {
    (async () => {
      if (isLoading) return;
      if (!transcriptions[questionIndex]) return;
      setIsLoading(true);
      const result = await askAssistant({ question: transcriptions[questionIndex], threadId });
      if (result) {
        setQuestionIndex(questionIndex + 1);
      }
      setIsLoading(false);
    })();
  }, [askLoop]);

  return (
    <div className="flex w-full h-full flex-col items-center pt-20">
      <div className="pb-10">
        <AudioRecorder
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
