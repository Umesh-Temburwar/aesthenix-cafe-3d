import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar, Clock, Users, MapPin, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { reservationService } from '../../services/reservationService';
import { ReservationConfirmation } from '../../types';

// Validation Schema with Zod
const reservationSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[+0-9\s-]+$/, 'Invalid phone number format'),
  date: z.string().refine((val) => {
    const selected = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today;
  }, 'Reservation date must be today or in the future'),
  time: z.string().min(1, 'Please select a preferred seating time'),
  guests: z.number().min(1, 'Minimum 1 guest').max(12, 'For parties larger than 12, please contact concierge'),
  seatingArea: z.enum(['main-floor', 'terrace', 'private-lounge', 'bar']),
  specialRequests: z.string().max(300, 'Special requests cannot exceed 300 characters').optional(),
});

type ReservationFormInputs = z.infer<typeof reservationSchema>;

export const ReservationForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<ReservationConfirmation | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReservationFormInputs>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      date: new Date().toISOString().split('T')[0],
      time: '19:00',
      guests: 2,
      seatingArea: 'private-lounge',
      specialRequests: '',
    },
  });

  const onSubmit = async (data: ReservationFormInputs) => {
    setIsSubmitting(true);
    try {
      const result = await reservationService.submitReservation({
        ...data,
        specialRequests: data.specialRequests || '',
      });
      setConfirmation(result);
      reset();
    } catch (err) {
      console.error('Reservation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const seatingOptions = [
    { id: 'private-lounge', label: 'The Velvet Mezzanine', desc: 'Plush velvet alcove with acoustic intimacy' },
    { id: 'bar', label: 'Grand Espresso Bar', desc: 'Front-row view of single-origin barista choreography' },
    { id: 'terrace', label: 'Glasshouse Atrium', desc: 'Sunlit olive trees and panoramic courtyard views' },
    { id: 'main-floor', label: 'Main Roastery Floor', desc: 'Aromatic heart of the coffee sanctuary' },
  ];

  return (
    <div className="relative">
      {/* Demo Mode Notice Badge */}
      <div className="flex items-center gap-2 p-3 mb-6 rounded-2xl bg-aura-card border border-aura-gold/30 text-xs text-aura-gold">
        <ShieldCheck className="w-4 h-4 shrink-0" />
        <span>
          <strong>Functional Demo Mode:</strong> Client-side validation and simulated booking reference generation active. Connect with backend API for live table holds.
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-aura-cream mb-2">
              Full Name *
            </label>
            <input
              type="text"
              {...register('fullName')}
              placeholder="e.g. Lorde Hastings"
              className="w-full px-4 py-3 rounded-xl bg-aura-bg border border-aura-border text-sm text-aura-cream placeholder-aura-muted/50 focus:outline-none focus:border-aura-gold focus:ring-1 focus:ring-aura-gold transition-colors"
            />
            {errors.fullName && (
              <p className="mt-1.5 text-xs text-red-400">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-aura-cream mb-2">
              Email Address *
            </label>
            <input
              type="email"
              {...register('email')}
              placeholder="concierge@example.com"
              className="w-full px-4 py-3 rounded-xl bg-aura-bg border border-aura-border text-sm text-aura-cream placeholder-aura-muted/50 focus:outline-none focus:border-aura-gold focus:ring-1 focus:ring-aura-gold transition-colors"
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-aura-cream mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              {...register('phone')}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 rounded-xl bg-aura-bg border border-aura-border text-sm text-aura-cream placeholder-aura-muted/50 focus:outline-none focus:border-aura-gold focus:ring-1 focus:ring-aura-gold transition-colors"
            />
            {errors.phone && (
              <p className="mt-1.5 text-xs text-red-400">{errors.phone.message}</p>
            )}
          </div>

          {/* Number of Guests */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-aura-cream mb-2 flex items-center justify-between">
              <span>Number of Guests *</span>
              <span className="text-aura-gold flex items-center gap-1 font-normal lowercase">
                <Users className="w-3.5 h-3.5" /> 1 to 12
              </span>
            </label>
            <select
              {...register('guests', { valueAsNumber: true })}
              className="w-full px-4 py-3 rounded-xl bg-aura-bg border border-aura-border text-sm text-aura-cream focus:outline-none focus:border-aura-gold focus:ring-1 focus:ring-aura-gold transition-colors"
            >
              {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                <option key={num} value={num} className="bg-aura-surface text-aura-cream">
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
            {errors.guests && (
              <p className="mt-1.5 text-xs text-red-400">{errors.guests.message}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-aura-cream mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-aura-gold" />
              Reservation Date *
            </label>
            <input
              type="date"
              {...register('date')}
              className="w-full px-4 py-3 rounded-xl bg-aura-bg border border-aura-border text-sm text-aura-cream focus:outline-none focus:border-aura-gold focus:ring-1 focus:ring-aura-gold transition-colors"
            />
            {errors.date && (
              <p className="mt-1.5 text-xs text-red-400">{errors.date.message}</p>
            )}
          </div>

          {/* Time Slot */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-aura-cream mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-aura-gold" />
              Seating Time *
            </label>
            <select
              {...register('time')}
              className="w-full px-4 py-3 rounded-xl bg-aura-bg border border-aura-border text-sm text-aura-cream focus:outline-none focus:border-aura-gold focus:ring-1 focus:ring-aura-gold transition-colors"
            >
              <optgroup label="Morning Coffee & Viennoiserie">
                <option value="08:00">08:00 AM</option>
                <option value="09:30">09:30 AM</option>
                <option value="11:00">11:00 AM</option>
              </optgroup>
              <optgroup label="Afternoon Cupping & Desserts">
                <option value="13:30">01:30 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="16:30">04:30 PM</option>
              </optgroup>
              <optgroup label="Evening Tasting Rituals">
                <option value="18:00">06:00 PM (Master Cupping Session)</option>
                <option value="19:30">07:30 PM</option>
                <option value="21:00">09:00 PM</option>
              </optgroup>
            </select>
            {errors.time && (
              <p className="mt-1.5 text-xs text-red-400">{errors.time.message}</p>
            )}
          </div>
        </div>

        {/* Preferred Seating Area */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-aura-cream mb-3 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-aura-gold" />
            Preferred Seating Zone *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {seatingOptions.map((opt) => (
              <label
                key={opt.id}
                className="relative flex items-start p-3.5 rounded-xl border border-aura-border bg-aura-bg/60 cursor-pointer hover:border-aura-gold/40 transition-colors"
              >
                <input
                  type="radio"
                  value={opt.id}
                  {...register('seatingArea')}
                  className="mt-1 text-aura-gold focus:ring-aura-gold"
                />
                <div className="ml-3">
                  <div className="text-xs font-semibold text-aura-cream">{opt.label}</div>
                  <div className="text-[11px] text-aura-muted">{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-aura-cream mb-2">
            Special Requests / Dietary Preferences (Optional)
          </label>
          <textarea
            {...register('specialRequests')}
            rows={3}
            placeholder="e.g. Anniversary celebration, prefer oat milk options, quieter booth for conversation..."
            className="w-full px-4 py-3 rounded-xl bg-aura-bg border border-aura-border text-sm text-aura-cream placeholder-aura-muted/50 focus:outline-none focus:border-aura-gold focus:ring-1 focus:ring-aura-gold transition-colors resize-none"
          />
          {errors.specialRequests && (
            <p className="mt-1.5 text-xs text-red-400">{errors.specialRequests.message}</p>
          )}
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-full text-xs font-semibold uppercase tracking-wider bg-aura-gold text-aura-bg hover:bg-aura-goldLight shadow-gold-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-aura-bg border-t-transparent rounded-full animate-spin" />
              <span>Verifying Table Availability...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Confirm Sanctuary Table Reservation</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* ================= CONFIRMATION MODAL ================= */}
      {confirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-card max-w-lg w-full p-8 rounded-3xl border border-aura-gold shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-aura-gold/15 border border-aura-gold flex items-center justify-center mb-5 text-aura-gold mx-auto shadow-gold-glow">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="text-center mb-6">
              <span className="text-[10px] uppercase font-bold tracking-widest text-aura-gold px-3 py-1 rounded-full bg-aura-gold/10 border border-aura-gold/30">
                Reservation Confirmed
              </span>
              <h3 className="font-serif text-3xl font-bold text-aura-cream mt-3 mb-1">
                We Await Your Presence
              </h3>
              <p className="text-xs text-aura-muted">
                Your sanctuary table has been allocated under Reference:
              </p>
              <div className="mt-2 text-lg font-mono font-bold tracking-wider text-aura-goldLight">
                {confirmation.bookingRef}
              </div>
            </div>

            <div className="bg-aura-bg/80 border border-aura-border rounded-2xl p-5 mb-6 space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-white/5">
                <span className="text-aura-muted">Guest of Honor:</span>
                <span className="text-aura-cream font-medium">{confirmation.fullName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/5">
                <span className="text-aura-muted">Date & Time:</span>
                <span className="text-aura-cream font-medium">
                  {confirmation.date} at {confirmation.time}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/5">
                <span className="text-aura-muted">Party Size:</span>
                <span className="text-aura-cream font-medium">
                  {confirmation.guests} {confirmation.guests === 1 ? 'Guest' : 'Guests'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-aura-muted">Seating Zone:</span>
                <span className="text-aura-gold capitalize font-medium">
                  {confirmation.seatingArea.replace('-', ' ')}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setConfirmation(null)}
              className="w-full py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-aura-gold text-aura-bg hover:bg-aura-goldLight shadow-gold-glow transition-all"
            >
              Done / Return to Experience
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
