import React, { useEffect, useRef, useState } from 'react';
import { useAmbientAudioStore } from '../../stores/useAmbientAudioStore';
import { ambientAudio, AmbientVibe } from '../../utils/ambientAudio';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Music2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  CloudRain,
  Coffee,
} from 'lucide-react';

export const AmbientSoundscapePlayer: React.FC = () => {
  const { isPlaying, volume, vibe, isExpanded, togglePlay, setVolume, setVibe, toggleExpanded } =
    useAmbientAudioStore();

  const [frequencyData, setFrequencyData] = useState<number[]>([12, 28, 45, 30, 18]);
  const animationFrameRef = useRef<number | null>(null);

  // Equalizer visualizer loop
  useEffect(() => {
    const dataArray = new Uint8Array(16);

    const updateVisualizer = () => {
      if (isPlaying) {
        ambientAudio.getFrequencyData(dataArray);
        // Take 5 bands
        const bands = [
          dataArray[1] || 15,
          dataArray[3] || 32,
          dataArray[5] || 48,
          dataArray[7] || 25,
          dataArray[9] || 18,
        ];
        setFrequencyData(bands);
      } else {
        setFrequencyData([6, 10, 14, 8, 5]);
      }
      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    };

    updateVisualizer();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying]);

  const vibes: { id: AmbientVibe; name: string; desc: string; icon: typeof Music2 }[] = [
    { id: 'midnight-jazz', name: 'Midnight Rhodes', desc: 'Warm 9th chords & vinyl', icon: Music2 },
    { id: 'tokyo-rain', name: 'Rainy Shibuya', desc: 'Reflective rain & steam', icon: CloudRain },
    { id: 'milan-roastery', name: 'Milanese Roast', desc: 'Espresso hum & clinks', icon: Coffee },
  ];

  const currentVibeObj = vibes.find((v) => v.id === vibe) || vibes[0];

  return (
    <aside
      aria-label="Ambient Lo-Fi Soundscape Player"
      className="fixed bottom-6 left-6 z-40 transition-all duration-300 font-sans select-none"
    >
      <div className="bg-[#140F0B]/90 backdrop-blur-xl border border-aura-gold/30 rounded-2xl shadow-2xl overflow-hidden max-w-xs transition-all">
        {/* Compact Bar (Always Visible) */}
        <div className="p-2.5 px-3.5 flex items-center gap-3">
          {/* Play / Pause Toggle Button */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause Ambient Soundscape' : 'Play Ambient Soundscape'}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 shrink-0 ${
              isPlaying
                ? 'bg-aura-gold text-aura-bg shadow-gold-glow animate-pulse'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={isPlaying ? 'Pause Ambient Soundscape' : 'Play Lo-Fi Café Ambiance'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-aura-bg" />
            ) : (
              <Play className="w-4 h-4 fill-white text-white ml-0.5" />
            )}
          </button>

          {/* Equalizer Visualizer & Vibe Info */}
          <div
            className="flex-1 cursor-pointer min-w-0"
            onClick={toggleExpanded}
            title="Click to change ambiance vibe & volume"
          >
            <div className="flex items-center gap-1.5 mb-1">
              {/* 5 Equalizer Spectrum Bars */}
              <div className="flex items-end gap-0.5 h-3.5 w-6 shrink-0">
                {frequencyData.map((val, idx) => {
                  const heightPercent = isPlaying ? Math.max(15, Math.min(100, (val / 180) * 100)) : 18;
                  return (
                    <span
                      key={idx}
                      className="w-1 rounded-full bg-aura-gold transition-all duration-75"
                      style={{ height: `${heightPercent}%` }}
                    />
                  );
                })}
              </div>
              <span className="text-[11px] font-semibold text-aura-cream truncate block tracking-wide">
                {currentVibeObj.name}
              </span>
            </div>
            <p className="text-[9px] text-aura-gold/70 uppercase tracking-widest font-mono">
              {isPlaying ? 'Live Procedural Audio' : 'Acoustic Soundscape'}
            </p>
          </div>

          {/* Expand / Minimize Toggle */}
          <button
            type="button"
            onClick={toggleExpanded}
            aria-label={isExpanded ? 'Collapse Soundscape Settings' : 'Expand Soundscape Settings'}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Expanded Settings Panel */}
        {isExpanded && (
          <div className="p-3.5 pt-1 border-t border-white/10 bg-black/40 flex flex-col gap-3">
            {/* Vibe Selection */}
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-aura-muted mb-1.5 block">
                Atmosphere Vibe
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {vibes.map((v) => {
                  const Icon = v.icon;
                  const isSelected = vibe === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVibe(v.id)}
                      className={`p-2 rounded-xl flex flex-col items-center gap-1 text-center transition-all ${
                        isSelected
                          ? 'bg-aura-gold/20 border border-aura-gold text-aura-gold'
                          : 'bg-white/5 border border-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-medium leading-tight">{v.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Volume Slider */}
            <div>
              <div className="flex items-center justify-between text-[10px] text-aura-muted mb-1">
                <span className="uppercase font-mono tracking-wider">Volume</span>
                <span className="font-mono text-aura-gold font-bold">{Math.round(volume * 100)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVolume(volume === 0 ? 0.35 : 0)}
                  aria-label={volume === 0 ? 'Unmute' : 'Mute'}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full accent-aura-gold h-1.5 bg-white/20 rounded-lg cursor-pointer"
                  title="Soundscape Volume"
                />
              </div>
            </div>

            {/* Tech Specs note */}
            <div className="pt-1 flex items-center justify-between text-[9px] text-white/40 font-mono">
              <span>Web Audio API Synth</span>
              <span>0 kB Network Latency</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
