import { useRef, useState, useEffect } from 'react';

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Create audio element with ambient music
    const audio = new Audio(
      'https://cdn.pixabay.com/audio/2022/10/25/audio_32de29c459.mp3'
    );
    audio.loop = true;
    audio.volume = 0.15;
    audioRef.current = audio;

    return () => {
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
