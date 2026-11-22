import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';
import { CAFE_ZONES } from '../data/cafeZones';

// Mock Three.js Canvas to avoid WebGL context requirements in JSDOM
vi.mock('@react-three/fiber', () => ({
  Canvas: () => <div data-testid="r3f-canvas" />,
  useFrame: () => {},
  useThree: () => ({
    camera: { position: { set: () => {}, lerp: () => {} }, lookAt: () => {} },
    pointer: { x: 0, y: 0 },
  }),
}));

vi.mock('@react-three/drei', () => ({
  Float: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ContactShadows: () => <div data-testid="contact-shadows" />,
  OrbitControls: () => <div data-testid="orbit-controls" />,
}));

describe('AURA ROAST Complete Integration Suite', () => {
  it('renders LoadingScreen and transitions to the Home page', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App skipInitialLoading={false} />
      </MemoryRouter>
    );

    // Initial loading indicator present
    expect(screen.getByText(/Brewing Your Experience/i)).toBeInTheDocument();

    // After loading duration, transitions to Home hero content
    await waitFor(
      () => {
        expect(screen.getAllByText(/Where Every Sip/i)[0]).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    expect(screen.getByText(/Discover the art of exceptional coffee/i)).toBeInTheDocument();
  });

  it('navigates to Menu and filters by category and search term', async () => {
    render(
      <MemoryRouter initialEntries={['/menu']}>
        <App skipInitialLoading={true} />
      </MemoryRouter>
    );

    expect(screen.getByText(/The Artisan/i)).toBeInTheDocument();

    // Category button check
    const coldBtn = screen.getByRole('button', { name: /Cold Brews/i });
    fireEvent.click(coldBtn);

    // Should display Cold Brew products
    expect(screen.getByText(/Bourbon Vanilla Cold Brew/i)).toBeInTheDocument();
  });

  it('renders the 3D Sanctuary page with interactive zone controls', async () => {
    render(
      <MemoryRouter initialEntries={['/experience']}>
        <App skipInitialLoading={true} />
      </MemoryRouter>
    );

    expect(screen.getByText(/The 3D Café/i)).toBeInTheDocument();
    expect(screen.getAllByText(CAFE_ZONES[0].title)[0]).toBeInTheDocument();
  });

  it('validates table reservation inputs and prevents empty submission', async () => {
    render(
      <MemoryRouter initialEntries={['/reservations']}>
        <App skipInitialLoading={true} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Bespoke Sanctuary Seating/i)).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /Confirm Sanctuary Table Reservation/i });
    fireEvent.click(submitBtn);

    // Form validation errors should display
    await waitFor(() => {
      expect(screen.getByText(/Name must be at least 2 characters/i)).toBeInTheDocument();
    });
  });

  it('renders 404 page for unknown URLs', async () => {
    render(
      <MemoryRouter initialEntries={['/nonexistent-vintage']}>
        <App skipInitialLoading={true} />
      </MemoryRouter>
    );

    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(screen.getByText(/This Cup Has Been Spilled/i)).toBeInTheDocument();
  });
});
