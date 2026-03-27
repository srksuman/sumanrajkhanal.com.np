import { useRef, useState, useEffect } from 'react';
import musicFile from '../assets/bg-music.mp3';
import clickOpenSound from '../assets/click-open.wav';
import clickCloseSound from '../assets/click-close.wav';

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasInteracted = useRef(false);

  useEffect(() => {
    const audio = new Audio(musicFile);
    audio.loop = true;
    audio.volume = 0.15;
    audioRef.current = audio;

    // Attempt immediate autoplay on mount
    const attemptImmediatePlay = () => {
      if (!audioRef.current) return;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        hasInteracted.current = true;
      }).catch(() => {
        // Browser blocked immediate autoplay, wait for interaction
      });
    };

    attemptImmediatePlay();

    const startAudio = () => {
      if (!hasInteracted.current && audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          hasInteracted.current = true;
          // Clean up listeners once audio plays
          window.removeEventListener('click', startAudio);
          window.removeEventListener('scroll', startAudio);
          window.removeEventListener('keydown', startAudio);
        }).catch(() => {
          // Autoplay blocked
        });
      }
    };

    window.addEventListener('click', startAudio);
    window.addEventListener('scroll', startAudio);
    window.addEventListener('keydown', startAudio);

    return () => {
      window.removeEventListener('click', startAudio);
      window.removeEventListener('scroll', startAudio);
      window.removeEventListener('keydown', startAudio);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // UI Audio elements
  const openAudioRef = useRef<HTMLAudioElement | null>(null);
  const closeAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    openAudioRef.current = new Audio(clickOpenSound);
    closeAudioRef.current = new Audio(clickCloseSound);
    openAudioRef.current.volume = 0.4;
    closeAudioRef.current.volume = 0.4;
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      if (closeAudioRef.current) {
        closeAudioRef.current.currentTime = 0;
        closeAudioRef.current.play().catch(() => {});
      }
    } else {
      audio.play().catch(() => {
        // Browser may block autoplay
      });
      if (openAudioRef.current) {
        openAudioRef.current.currentTime = 0;
        openAudioRef.current.play().catch(() => {});
      }
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      className="music-toggle"
      onClick={toggleMusic}
      aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
      title={isPlaying ? 'Pause Music' : 'Play Music'}
    >
      <div className={`music-bars ${isPlaying ? 'playing' : ''}`}>
        <span />
        <span />
        <span />
        <span />
      </div>
    </button>
  );
}
