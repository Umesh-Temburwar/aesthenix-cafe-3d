import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-aura-bg flex items-center justify-center px-6 pt-20">
      <div className="max-w-md w-full text-center glass-card p-10 rounded-3xl border border-aura-gold/30 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-aura-card border border-aura-gold/30 flex items-center justify-center mx-auto mb-6 shadow-gold-glow">
          <Coffee className="w-8 h-8 text-aura-gold" />
        </div>
        <div className="font-serif text-6xl font-bold text-aura-gold mb-2">404</div>
        <h2 className="font-serif text-2xl font-bold text-aura-cream mb-3">
          This Cup Has Been Spilled
        </h2>
        <p className="text-xs text-aura-muted leading-relaxed mb-6">
          The requested vintage or page could not be located in our sanctuary archives.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-aura-gold text-aura-bg hover:bg-aura-goldLight shadow-gold-glow transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Coffee Sanctuary</span>
        </Link>
      </div>
    </div>
  );
};
