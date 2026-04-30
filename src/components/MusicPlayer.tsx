import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Drive [AI_SYNTH_01]',
    artist: 'Neural Network Audio',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '6:12',
  },
  {
    id: 2,
    title: 'Cyber Protocol [AI_SYNTH_02]',
    artist: 'Neural Network Audio',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '7:05',
  },
  {
    id: 3,
    title: 'Night City Vibes [AI_SYNTH_03]',
    artist: 'Neural Network Audio',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '5:44',
  },
];

const formatTime = (timeInSeconds: number) => {
  if (isNaN(timeInSeconds)) return '0:00';
  const mins = Math.floor(timeInSeconds / 60);
  const secs = Math.floor(timeInSeconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio playback prevented:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    // Autoplay when changing tracks if it was already playing
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(e => console.error("Autoplay prevented:", e));
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handeTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="flex flex-col w-full max-w-sm p-6 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-fuchsia-500/30 shadow-[0_0_30px_rgba(217,70,239,0.15)] relative overflow-hidden z-10">
      <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-500/5 to-transparent pointer-events-none"></div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handeTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-fuchsia-400">
          <Music className="w-5 h-5 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]" />
          <span className="font-mono text-xs tracking-widest uppercase opacity-80">Audio Protocol</span>
        </div>
        
        {/* Equalizer Animation (Mock) */}
        <div className="flex items-end gap-[2px] h-4">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={`w-1 bg-fuchsia-400 rounded-t-sm shadow-[0_0_5px_rgba(217,70,239,0.5)] ${isPlaying ? 'animate-pulse' : 'h-1'}`}
              style={isPlaying ? { 
                height: `${Math.random() * 100 + 20}%`,
                animationDuration: `${0.5 + i * 0.1}s`,
                animationIterationCount: 'infinite',
                animationDirection: 'alternate'
              } : {}}
            />
          ))}
        </div>
      </div>

      {/* Track Info */}
      <div className="mb-6 text-center">
        <h3 className="text-cyan-300 font-mono text-lg truncate mb-1 drop-shadow-[0_0_5px_rgba(103,232,249,0.8)]">
          {currentTrack.title}
        </h3>
        <p className="text-fuchsia-500/60 font-mono text-xs uppercase tracking-wider">
          {currentTrack.artist}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div 
          ref={progressRef}
          className="h-1.5 w-full bg-slate-800 rounded-full cursor-pointer relative group overflow-hidden"
          onClick={handleProgressClick}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.5)] pointer-events-none"
            style={{ width: `${(progress / duration) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 font-mono text-[10px] text-slate-500">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="text-slate-500 hover:text-cyan-400 transition-colors p-2"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-4">
          <button 
            onClick={prevTrack}
            className="text-fuchsia-400 hover:text-cyan-300 hover:scale-110 transition-all p-2 drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-black/50 border border-fuchsia-400 text-fuchsia-400 hover:bg-fuchsia-400 hover:text-black hover:shadow-[0_0_20px_rgba(217,70,239,0.6)] transition-all"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-1" />
            )}
          </button>
          
          <button 
            onClick={nextTrack}
            className="text-fuchsia-400 hover:text-cyan-300 hover:scale-110 transition-all p-2 drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>

        <div className="w-8" /> {/* Spacer to balance layout */}
      </div>
      
      {/* Track List Mini */}
      <div className="mt-6 border-t border-slate-800/50 pt-4">
        <div className="text-[10px] font-mono text-slate-500 mb-2 uppercase tracking-widest">Playlist</div>
        <div className="space-y-2">
          {TRACKS.map((track, idx) => (
            <div 
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(idx);
                setIsPlaying(true);
              }}
              className={`flex items-center justify-between text-xs font-mono p-1.5 rounded cursor-pointer transition-colors ${
                idx === currentTrackIndex 
                  ? 'text-cyan-300 bg-cyan-950/30 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
                  : 'text-slate-400 hover:bg-slate-800/50'
              }`}
            >
              <span className="truncate pr-2">{track.id}. {track.title}</span>
              <span className="opacity-50 shrink-0">{track.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
