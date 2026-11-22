import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../useCartStore';
import { PRODUCTS, standardSizes } from '../../data/products';

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('starts with an empty cart', () => {
    const { items, getTotalItems, getSubtotal } = useCartStore.getState();
    expect(items).toEqual([]);
    expect(getTotalItems()).toBe(0);
    expect(getSubtotal()).toBe(0);
  });

  it('adds an item to cart correctly', () => {
    const product = PRODUCTS[0];
    const size = standardSizes[0]; // multiplier 1.0

    useCartStore.getState().addItem(product, size, 2);

    const { items, getTotalItems, getSubtotal } = useCartStore.getState();
    expect(items.length).toBe(1);
    expect(items[0].product.id).toBe(product.id);
    expect(items[0].quantity).toBe(2);
    expect(items[0].unitPrice).toBe(product.price);
    expect(getTotalItems()).toBe(2);
    expect(getSubtotal()).toBe(product.price * 2);
  });

  it('differentiates between sizes for the same product', () => {
    const product = PRODUCTS[0];
    const size1 = standardSizes[0]; // Regular
    const size2 = standardSizes[1]; // Grande

    useCartStore.getState().addItem(product, size1, 1);
    useCartStore.getState().addItem(product, size2, 1);

    const { items } = useCartStore.getState();
    expect(items.length).toBe(2);
    expect(items[0].size.name).toBe('Regular');
    expect(items[1].size.name).toBe('Grande');
  });

  it('increments quantity when adding identical product and size', () => {
    const product = PRODUCTS[0];
    const size = standardSizes[0];

    useCartStore.getState().addItem(product, size, 1);
    useCartStore.getState().addItem(product, size, 2);

    const { items } = useCartStore.getState();
    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(3);
  });

  it('updates quantity and removes item when quantity reaches zero', () => {
    const product = PRODUCTS[0];
    const size = standardSizes[0];

    useCartStore.getState().addItem(product, size, 2);
    const itemId = `${product.id}-${size.name.toLowerCase()}`;

    useCartStore.getState().updateQuantity(itemId, -1);
    expect(useCartStore.getState().items[0].quantity).toBe(1);

    useCartStore.getState().updateQuantity(itemId, -1);
    expect(useCartStore.getState().items.length).toBe(0);
  });

  it('calculates GST tax and packaging fees accurately', () => {
    const product = PRODUCTS[0]; // price 260
    const size = standardSizes[0];

    useCartStore.getState().addItem(product, size, 1);
    // Subtotal: 260
    // Tax: 5% of 260 = 13
    // Packaging fee: 40 (since subtotal < 600)
    // Grand Total: 260 + 13 + 40 = 313

    const { getSubtotal, getTaxAmount, getPackagingFee, getGrandTotal } = useCartStore.getState();
    expect(getSubtotal()).toBe(260);
    expect(getTaxAmount()).toBe(13);
    expect(getPackagingFee()).toBe(40);
    expect(getGrandTotal()).toBe(313);

    // Add another item to push subtotal >= 600
    useCartStore.getState().addItem(product, size, 2);
    // Total quantity: 3 -> Subtotal = 780
    // Packaging fee becomes complimentary (0)
    // Tax: 5% of 780 = 39
    // Grand Total: 780 + 39 + 0 = 819
    expect(useCartStore.getState().getSubtotal()).toBe(780);
    expect(useCartStore.getState().getPackagingFee()).toBe(0);
    expect(useCartStore.getState().getTaxAmount()).toBe(39);
    expect(useCartStore.getState().getGrandTotal()).toBe(819);
  });
});
