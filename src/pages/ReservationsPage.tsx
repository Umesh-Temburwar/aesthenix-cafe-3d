import React from 'react';
import { ReservationForm } from '../components/reservations/ReservationForm';
import { Calendar, Users, Clock, Award, ShieldCheck, Sparkles } from 'lucide-react';

export const ReservationsPage: React.FC = () => {
  return (
    <div className="pt-28 pb-24 min-h-screen bg-aura-bg">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] uppercase font-bold tracking-widest text-aura-gold px-3 py-1 rounded-full bg-aura-gold/15 border border-aura-gold/30 inline-block mb-3">
            Bespoke Sanctuary Seating
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-aura-cream mb-4">
            Table <span className="gold-gradient-text italic font-normal">Reservations</span>
          </h1>
          <p className="text-xs sm:text-sm text-aura-muted leading-relaxed">
            Reserve your place at the Grand Espresso Bar, the quiet Velvet Mezzanine, or the sunlit Glasshouse Atrium.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Reservation Policy & Ambiance Guide (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-aura-border space-y-4">
              <h3 className="font-serif text-xl font-bold text-aura-cream flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-aura-gold" />
                Sanctuary Protocol
              </h3>

              <div className="space-y-3 text-xs text-aura-muted leading-relaxed">
                <p>
                  • <strong>Arrival Window:</strong> Tables are held for 15 minutes past your reserved seating time before release to waitlisted guests.
                </p>
                <p>
                  • <strong>Acoustic Harmony:</strong> In respect of fellow guests, we request mobile devices remain on silent mode in all seating zones.
                </p>
                <p>
                  • <strong>Tasting Rituals:</strong> Our 6:00 PM evening seating includes a complimentary tableside single-origin aroma presentation.
                </p>
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-aura-border">
              <h4 className="font-serif text-base font-bold text-aura-cream mb-2">
                Private Buyouts & Events
              </h4>
              <p className="text-xs text-aura-muted leading-relaxed mb-4">
                Looking to host a private cupping masterclass or intimate corporate salon? Contact our head concierge directly.
              </p>
              <div className="text-xs text-aura-gold font-medium">
                events@auraroast.com
              </div>
            </div>
          </div>

          {/* Main Reservation Form Card (8 cols) */}
          <div className="lg:col-span-8 glass-card p-6 md:p-10 rounded-3xl border border-aura-gold/30 shadow-2xl">
            <ReservationForm />
          </div>
        </div>
      </div>
    </div>
  );
};
