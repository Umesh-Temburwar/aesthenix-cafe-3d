import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CafeInteriorScene } from '../scenes/CafeInterior/CafeInteriorScene';
import { StorefrontScene } from '../scenes/Storefront/StorefrontScene';
import { Compass, Volume2, VolumeX, Eye, ArrowLeft, Building2, Store } from 'lucide-react';

export const ExperiencePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('view') === 'storefront' ? 'storefront' : 'interior';
  const [activeTab, setActiveTab] = useState<'storefront' | 'interior'>(initialTab);
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
              The 3D Café{' '}
              <span className="gold-gradient-text italic font-normal">
                {activeTab === 'storefront' ? 'Storefront Exterior' : 'Interior Sanctuary'}
              </span>
            </h1>
          </div>

          {/* View Switcher Tabs & Sound */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Storefront vs Interior Tab Switcher */}
            <div className="flex items-center p-1 rounded-full bg-aura-card border border-aura-border text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('storefront')}
                className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'storefront'
                    ? 'bg-aura-gold text-aura-bg font-semibold shadow-gold-glow'
                    : 'text-aura-muted hover:text-aura-cream'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Storefront Exterior</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('interior')}
                className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'interior'
                    ? 'bg-aura-gold text-aura-bg font-semibold shadow-gold-glow'
                    : 'text-aura-muted hover:text-aura-cream'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Interior Sanctuary</span>
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className="glass-card px-3.5 py-2 rounded-full border border-aura-border text-xs text-aura-cream hover:border-aura-gold transition-colors flex items-center gap-2"
              title="Toggle Audio"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-aura-gold" />
                  <span className="text-aura-gold font-medium">Audio On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-aura-muted" />
                  <span className="text-aura-muted">Muted</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Fullscreen 3D Scene Container */}
        <div className="flex-1 w-full min-h-[640px] rounded-3xl overflow-hidden shadow-2xl border border-aura-gold/30 relative">
          {activeTab === 'storefront' ? (
            <StorefrontScene
              showControlsOverlay={true}
              onEnterInterior={() => setActiveTab('interior')}
            />
          ) : (
            <CafeInteriorScene showControlsOverlay={true} />
          )}
        </div>

        {/* Footer Guidance */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-aura-muted gap-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-aura-gold" />
            <span>
              {activeTab === 'storefront'
                ? 'Watch the 3D letters assemble with bounce physics and glint sweeps. Click "Walk Inside Sanctuary" to enter.'
                : 'Click any glowing gold hotspot in the scene to glide through the 4 spatial zones.'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {activeTab === 'interior' && (
              <button
                type="button"
                onClick={() => setActiveTab('storefront')}
                className="text-aura-gold hover:underline font-medium"
              >
                ← Return to Storefront Exterior
              </button>
            )}
            <span>Optimized with Three.js WebGL & hardware acceleration.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
