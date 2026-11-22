import React, { useState } from 'react';
import { CafeInteriorScene } from '../scenes/CafeInterior/CafeInteriorScene';
import { Compass, Volume2, VolumeX, Eye, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ExperiencePage: React.FC = () => {
  const [soundEnabled, setSoundEnabled] = useState(false);

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-aura-bg flex flex-col">
      <div className="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-aura-muted hover:text-aura-gold transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-aura-cream">
              The 3D Café <span className="gold-gradient-text italic font-normal">Sanctuary</span>
            </h1>
          </div>

          {/* Sound & Mode Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSound}
              className="glass-card px-3.5 py-2 rounded-full border border-aura-border text-xs text-aura-cream hover:border-aura-gold transition-colors flex items-center gap-2"
              title="Toggle Ambient Audio"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-aura-gold" />
                  <span className="text-aura-gold font-medium">Ambient Audio On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-aura-muted" />
                  <span className="text-aura-muted">Ambiance Muted</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Fullscreen 3D Scene Container */}
        <div className="flex-1 w-full min-h-[640px] rounded-3xl overflow-hidden shadow-2xl border border-aura-gold/30 relative">
          <CafeInteriorScene showControlsOverlay={true} />
        </div>

        {/* Footer Guidance */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-aura-muted gap-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-aura-gold" />
            <span>Click any glowing gold hotspot in the scene to navigate to that zone.</span>
          </div>
          <div>
            <span>Optimized with hardware acceleration & smooth camera damping.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
