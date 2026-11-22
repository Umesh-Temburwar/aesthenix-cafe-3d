import { describe, it, expect, beforeEach } from 'vitest';
import { reservationService } from '../reservationService';
import { ReservationFormData } from '../../types';

describe('reservationService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('generates a formatted reference code and confirms reservation', async () => {
    const formData: ReservationFormData = {
      fullName: 'Aria Sharma',
      email: 'aria.sharma@example.com',
      phone: '+91 98765 43210',
      date: '2026-12-15',
      time: '19:30',
      guests: 2,
      seatingArea: 'private-lounge',
      specialRequests: 'Window table with calm acoustics please',
    };

    const result = await reservationService.submitReservation(formData);

    expect(result).toBeDefined();
    expect(result.id).toContain('res_');
    expect(result.bookingRef).toMatch(/^AURA-\d{4}-\d{4}$/);
    expect(result.status).toBe('confirmed');
    expect(result.fullName).toBe('Aria Sharma');
    expect(result.guests).toBe(2);

    // Verify stored reservations
    const stored = reservationService.getStoredReservations();
    expect(stored.length).toBe(1);
    expect(stored[0].bookingRef).toBe(result.bookingRef);
  });
});
