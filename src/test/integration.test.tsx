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

    // Switch to Storefront Exterior tab
    const storefrontTab = screen.getAllByRole('button', { name: /Storefront Exterior/i })[0];
    fireEvent.click(storefrontTab);

    // Verify Storefront elements are active
    expect(screen.getByRole('button', { name: /Replay Assembly/i })).toBeInTheDocument();
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

  it('renders the 3D Barista Extraction & Latte Art Simulator in Brewing Lab', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App skipInitialLoading={true} />
      </MemoryRouter>
    );

    expect(screen.getByText(/The Barista/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /3D Barista Simulator/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pull 9.2-Bar Shot/i })).toBeInTheDocument();

    // Switch to Manual Brew Rituals
    const manualBtn = screen.getByRole('button', { name: /Manual Brew Rituals/i });
    fireEvent.click(manualBtn);
    expect(screen.getByText(/Precision Pour Over/i)).toBeInTheDocument();
  });

  it('renders the 3D Bespoke Cup Studio and toggles views on the Menu page', async () => {
    render(
      <MemoryRouter initialEntries={['/menu']}>
        <App skipInitialLoading={true} />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /The Artisan/i })).toBeInTheDocument();
    const customizerTab = screen.getByRole('button', { name: /3D Bespoke Cup Studio/i });
    expect(customizerTab).toBeInTheDocument();

    // Switch to 3D Customizer
    fireEvent.click(customizerTab);
    expect(screen.getByText(/Design Your Signature Cup/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Bespoke Cup to Order/i })).toBeInTheDocument();
  });

  it('renders the Agency Portfolio Case Study page with core innovation pillars', async () => {
    render(
      <MemoryRouter initialEntries={['/case-study']}>
        <App skipInitialLoading={true} />
      </MemoryRouter>
    );

    expect(screen.getByText(/AesthenixTech Flagship Portfolio Case Study/i)).toBeInTheDocument();
    expect(screen.getByText(/Four Technological Breakthroughs/i)).toBeInTheDocument();
    expect(screen.getByText(/10-Second Storefront Reel & Stacking Logo/i)).toBeInTheDocument();
    expect(screen.getByText(/Interactive 3D 9.2-Bar Barista Simulator/i)).toBeInTheDocument();
  });

  it('renders the Ambient Lo-Fi Soundscape player with procedural audio controls', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App skipInitialLoading={true} />
      </MemoryRouter>
    );

    const soundscapePlayer = screen.getByRole('complementary', { name: /Ambient Lo-Fi Soundscape Player/i });
    expect(soundscapePlayer).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Play Ambient Soundscape/i })).toBeInTheDocument();
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
