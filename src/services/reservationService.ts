import { ReservationConfirmation, ReservationFormData } from '../types';

const STORAGE_KEY = 'aura_roast_reservations';

/**
 * Service abstraction for Table Reservations.
 * Currently runs in demo/local mode with simulated network latency and mock reference codes.
 * Can be connected to Supabase, Firebase, or custom backend by configuring environment variables.
 */
export const reservationService = {
  /**
   * Submit a table reservation request
   */
  async submitReservation(formData: ReservationFormData): Promise<ReservationConfirmation> {
    // Simulate network latency (400ms - 800ms)
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Generate luxurious reservation reference number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const datePrefix = formData.date.replace(/-/g, '').slice(2, 6);
    const bookingRef = `AURA-${datePrefix}-${randomSuffix}`;

    const confirmation: ReservationConfirmation = {
      ...formData,
      id: `res_${Date.now()}_${randomSuffix}`,
      bookingRef,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    };

    // Store in local storage for persistence across visits
    try {
      const existingRaw = localStorage.getItem(STORAGE_KEY);
      const existing: ReservationConfirmation[] = existingRaw ? JSON.parse(existingRaw) : [];
      existing.unshift(confirmation);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 10)));
    } catch {
      // Ignore local storage error in sandboxed environments
    }

    return confirmation;
  },

  /**
   * Retrieve past reservations from local storage
   */
  getStoredReservations(): ReservationConfirmation[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
};
