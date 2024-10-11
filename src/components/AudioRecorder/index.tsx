'use client';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@nextui-org/button';
import { AudioResponse } from '@/types';

const SEND_AUDIO_INTERVAL = process.env.NEXT_PUBLIC_SEND_AUDIO_INTERVAL
  ? Number(process.env.NEXT_PUBLIC_SEND_AUDIO_INTERVAL)
  : 3000;

type Props = {
  onStartRecording: () => void;
  onStopRecording: () => void;
  onNewTranscript: (transcript: string) => void;
};

export default function AudioRecorder({ onNewTranscript, onStartRecording, onStopRecording }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        chunksRef.current = [];
        setAudioBlob(blob);
      };

      mediaRecorderRef.current.start(); //SEND_AUDIO_INTERVAL;
      setIsRecording(true);

      intervalRef.current = setInterval(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
          mediaRecorderRef.current.start(); //SEND_AUDIO_INTERVAL;
        }
      }, SEND_AUDIO_INTERVAL);
      onStartRecording();
    } catch (error) {
      if (error instanceof DOMException) {
        toast.error(error.message);
      }
      console.dir(error)
     
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setIsRecording(false);
    }
    onStopRecording();
  };

  const sendAudioToServer = async (blob: Blob) => {
    const formData = new FormData();
    formData.append('audio', blob, 'audio.webm');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      const result: AudioResponse = await response.json();

      if (result.transcript) {
        onNewTranscript(result.transcript);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (audioBlob) {
      sendAudioToServer(audioBlob);
    }
  }, [audioBlob]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flex items-center justify-center flex-col gap-3">
      <h1 className="text-lg">Audio Recorder</h1>
      <Button color={isRecording ? 'danger' : 'primary'} onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button>
    </div>
  );
}
