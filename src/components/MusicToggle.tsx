import { useRef, useState, useEffect } from 'react';
import musicFile from '../assets/bg-music.mp3';

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasInteracted = useRef(false);

  useEffect(() => {
    const audio = new Audio(musicFile);
    audio.loop = true;
    audio.volume = 0.15;
    audioRef.current = audio;

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

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        // Browser may block autoplay
      });
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
