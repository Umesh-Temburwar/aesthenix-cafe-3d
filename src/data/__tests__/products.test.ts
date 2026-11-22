import { describe, it, expect } from 'vitest';
import { PRODUCTS } from '../products';

describe('PRODUCTS dataset', () => {
  it('contains the required 8 signature coffee items', () => {
    const requiredProductIds = [
      'signature-espresso',
      'classic-cappuccino',
      'caramel-latte',
      'iced-americano',
      'mocha-delight',
      'vanilla-cold-brew',
      'hazelnut-macchiato',
      'affogato-al-caffe',
    ];

    const existingIds = PRODUCTS.map((p) => p.id);
    for (const requiredId of requiredProductIds) {
      expect(existingIds).toContain(requiredId);
    }
  });

  it('ensures all products have realistic INR pricing (> 0)', () => {
    PRODUCTS.forEach((product) => {
      expect(product.price).toBeGreaterThan(100);
      expect(product.price).toBeLessThan(1000);
    });
  });

  it('ensures all products have complete 3D configuration', () => {
    PRODUCTS.forEach((product) => {
      expect(product.model3D).toBeDefined();
      expect(product.model3D.cupColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(product.sizes.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('correctly filters products by category', () => {
    const hotProducts = PRODUCTS.filter((p) => p.category === 'hot');
    const coldProducts = PRODUCTS.filter((p) => p.category === 'cold');
    const bakeryProducts = PRODUCTS.filter((p) => p.category === 'bakery');

    expect(hotProducts.length).toBeGreaterThan(0);
    expect(coldProducts.length).toBeGreaterThan(0);
    expect(bakeryProducts.length).toBeGreaterThan(0);
  });
});
