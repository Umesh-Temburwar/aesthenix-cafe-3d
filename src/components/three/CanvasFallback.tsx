import React from 'react';
import { Coffee, Sparkles } from 'lucide-react';

interface CanvasFallbackProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

export const CanvasFallback: React.FC<CanvasFallbackProps> = ({
  title = 'AURA ROAST Interactive View',
  subtitle = 'High-fidelity visual display mode enabled',
  imageUrl = 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=1200&q=80',
}) => {
  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center overflow-hidden rounded-2xl border border-aura-border bg-aura-surface">
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover opacity-50 filter brightness-75 scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-aura-bg via-aura-bg/60 to-transparent" />

      <div className="relative z-10 text-center px-6 max-w-md">
        <div className="inline-flex p-3 rounded-full bg-aura-card border border-aura-gold/30 mb-4 shadow-gold-glow animate-pulse">
          <Coffee className="w-8 h-8 text-aura-gold" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-aura-cream mb-2 tracking-wide">
          {title}
        </h3>
        <p className="text-sm text-aura-muted flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-aura-gold inline" />
          {subtitle}
        </p>
      </div>
    </div>
  );
};
