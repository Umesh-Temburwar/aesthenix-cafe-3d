import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { FlavorRadarChart } from '../components/menu/FlavorRadarChart';
import { CartDrawer } from '../components/cart/CartDrawer';
import { useCartStore } from '../stores/useCartStore';
import { PRODUCTS } from '../data/products';
import { BrowserRouter } from 'react-router-dom';

describe('Flagship Features Test Suite', () => {
  describe('FlavorRadarChart Sensory Matrix', () => {
    it('renders 5 sensory axes and custom tasting notes', () => {
      render(
        <FlavorRadarChart
          category="hot"
          roastLevel="Medium-Dark"
          tastingNotes={['Wild Jasmine', 'Dark Cocoa', 'Bergamot Citrus']}
          flavorProfile={{
            acidity: 78,
            body: 92,
            sweetness: 80,
            finish: 90,
            aroma: 94,
          }}
        />
      );

      expect(screen.getByText(/Terroir Sensory Radar/i)).toBeInTheDocument();
      expect(screen.getByText(/SCA 100-Pt Matrix/i)).toBeInTheDocument();
      expect(screen.getByText('Acidity')).toBeInTheDocument();
      expect(screen.getByText('Body')).toBeInTheDocument();
      expect(screen.getByText('Sweetness')).toBeInTheDocument();
      expect(screen.getByText('Finish')).toBeInTheDocument();
      expect(screen.getByText('Aroma')).toBeInTheDocument();

      // Tasting note pills
      expect(screen.getByText('Wild Jasmine')).toBeInTheDocument();
      expect(screen.getByText('Dark Cocoa')).toBeInTheDocument();
      expect(screen.getByText('Bergamot Citrus')).toBeInTheDocument();
    });

    it('falls back to category defaults when flavorProfile is omitted', () => {
      render(
        <FlavorRadarChart
          category="cold"
          roastLevel="Light-Medium"
        />
      );

      expect(screen.getByText(/Terroir Sensory Radar/i)).toBeInTheDocument();
      expect(screen.getByText('Acidity')).toBeInTheDocument();
    });
  });

  describe('Live Barista Order Tracker in CartDrawer', () => {
    it('activates live tracker flow and displays order stages upon confirmation', () => {
      const { addItem, openCart } = useCartStore.getState();
      
      act(() => {
        addItem(PRODUCTS[0], PRODUCTS[0].sizes[0], 1);
        openCart();
      });

      render(
        <BrowserRouter>
          <CartDrawer />
        </BrowserRouter>
      );

      // Open checkout modal
      const checkoutBtn = screen.getByRole('button', { name: /Proceed to Demo Checkout/i });
      fireEvent.click(checkoutBtn);

      expect(screen.getByText(/Demo Checkout Experience/i)).toBeInTheDocument();

      // Confirm demo order
      const confirmBtn = screen.getByRole('button', { name: /Confirm Demo Order/i });
      fireEvent.click(confirmBtn);

      // Live Barista Tracker is activated
      expect(screen.getByText(/Live Barista Tracker/i)).toBeInTheDocument();
      expect(screen.getByText(/Order #AURA-/i)).toBeInTheDocument();
      expect(screen.getByText(/EK43 Precision Grind/i)).toBeInTheDocument();

      // Step bead navigation
      const extractionBead = screen.getByRole('button', { name: /02/i });
      fireEvent.click(extractionBead);

      expect(screen.getByText(/9.2-Bar Hydraulic Extraction/i)).toBeInTheDocument();

      // Close / Pick up order
      const pickupBtn = screen.getByRole('button', { name: /Pick Up & Done/i });
      fireEvent.click(pickupBtn);

      // Cart should now be empty
      expect(useCartStore.getState().items.length).toBe(0);
    });
  });
});
