import { useState, useCallback, useEffect, useRef } from 'react';

export function useTTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, []);

  const speakSequence = useCallback((sequence: {text: string, pitch?: number, rate?: number, voiceIndex?: number}[]) => {
    // The user requested to use the provided mp3 instead of TTS.
    // Based on the platform convention, the uploaded mp3 is expected at /input_file_3.mp3
    
    if (!audioRef.current) {
      audioRef.current = new Audio('/tts.mp3');
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onerror = () => {
        console.error('Audio playback error for /tts.mp3');
        setIsPlaying(false);
      };
    }

    // Stop current playback before starting new one
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    
    // Note: We are playing the provided MP3 as the "voice" for the scenario.
    audioRef.current.play().catch(err => {
      console.warn('Audio play failed:', err);
      setIsPlaying(false);
    });
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { speakSequence, stop, isPlaying };
}
