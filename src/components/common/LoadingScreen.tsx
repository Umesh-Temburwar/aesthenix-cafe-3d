import React, { useEffect, useState } from 'react';
import { Coffee, Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  onComplete?: () => void;
  minDurationMs?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  minDurationMs = 1200,
}) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / minDurationMs) * 100), 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setIsFadingOut(true);
        setTimeout(() => {
          onComplete?.();
        }, 400);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [minDurationMs, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-aura-bg flex flex-col items-center justify-center transition-opacity duration-400 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center max-w-sm px-6 text-center">
        {/* Animated Coffee Icon with Ring Glow */}
        <div className="relative w-20 h-20 rounded-3xl bg-aura-card border border-aura-gold/40 flex items-center justify-center mb-6 shadow-gold-glow animate-pulse">
          <Coffee className="w-10 h-10 text-aura-gold" />
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-4 h-4 text-aura-goldLight animate-spin" />
          </div>
        </div>

        {/* Brand */}
        <span className="font-serif text-3xl font-bold tracking-widest text-aura-cream mb-1">
          AURA ROAST
        </span>
        <p className="text-xs tracking-widest uppercase text-aura-gold mb-8 italic">
          Brewing Your Experience...
        </p>

        {/* Real / Smooth Progress Bar */}
        <div className="w-48 h-1 rounded-full bg-aura-surface border border-aura-border overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-aura-coffee via-aura-gold to-aura-goldLight transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[10px] text-aura-muted font-mono tracking-wider">
          {progress}%
        </span>
      </div>
    </div>
  );
};
