import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Coffee, 
  Sparkles, 
  Flame, 
  Clock, 
  Check, 
  ChevronRight 
} from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';
import { formatINR } from '../../utils/format';
import { Link } from 'react-router-dom';

const TRACKER_STAGES = [
  {
    step: 1,
    title: 'EK43 Precision Grind',
    description: '18.5g single-origin microlot weighed to ±0.05g at 350 microns.',
    station: 'Grind Station A • EK43S',
  },
  {
    step: 2,
    title: '9.2-Bar Hydraulic Extraction',
    description: 'E61 saturated grouphead at 93.5°C pulling 36g golden hazelnut crema.',
    station: 'Group 1 • Custom Brass E61',
  },
  {
    step: 3,
    title: 'Artisanal Microfoam Steaming',
    description: 'Organic Guernsey milk textured to 62°C with artisanal rosetta pour.',
    station: 'Steam Bay 2 • Dry Steam Wand',
  },
  {
    step: 4,
    title: 'Ready at Sanctuary Bar',
    description: 'Presented on hammered brass tray with crystal sparkling water.',
    station: 'Pickup Counter • Sanctuary Lounge',
  },
];

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    getTaxAmount,
    getPackagingFee,
    getGrandTotal,
  } = useCartStore();

  const [isCheckoutDemoOpen, setIsCheckoutDemoOpen] = useState(false);
  const [demoOrderPlaced, setDemoOrderPlaced] = useState(false);
  const [orderCode, setOrderCode] = useState('');
  const [orderSnapshot, setOrderSnapshot] = useState<typeof items>([]);
  const [trackerStage, setTrackerStage] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!demoOrderPlaced) return;
    const interval = setInterval(() => {
      setTrackerStage((prev) => (prev < 3 ? prev + 1 : prev));
    }, 3200);
    return () => clearInterval(interval);
  }, [demoOrderPlaced]);

  const subtotal = getSubtotal();
  const tax = getTaxAmount();
  const packaging = getPackagingFee();
  const grandTotal = getGrandTotal();

  if (!isOpen) return null;

  const handleSimulateDemoCheckout = () => {
    const code = '#AURA-' + Math.floor(1000 + Math.random() * 9000);
    setOrderCode(code);
    setOrderSnapshot([...items]);
    setTrackerStage(0);
    setDemoOrderPlaced(true);
    clearCart();
  };

  const resetCheckoutModal = () => {
    setIsCheckoutDemoOpen(false);
    setDemoOrderPlaced(false);
    setTrackerStage(0);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-aura-surface border-l border-aura-border flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-aura-border flex items-center justify-between bg-aura-bg/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-aura-card border border-aura-gold/30 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-aura-gold" />
              </div>
              <h3 className="font-serif text-xl font-bold text-aura-cream">
                Your Coffee Bag
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-aura-coffee/50 text-aura-gold border border-aura-border">
                {items.reduce((acc, i) => acc + i.quantity, 0)} items
              </span>
            </div>

            <button
              type="button"
              onClick={closeCart}
              className="p-2 rounded-full hover:bg-white/5 text-aura-muted hover:text-aura-cream transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-aura-card border border-aura-border flex items-center justify-center mb-4 text-aura-gold">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <h4 className="font-serif text-lg font-bold text-aura-cream mb-1">
                  Your bag is currently empty
                </h4>
                <p className="text-xs text-aura-muted max-w-xs mb-6">
                  Explore our single-origin roasts, signature chilled infusions, and artisanal viennoiserie.
                </p>
                <Link
                  to="/menu"
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-aura-gold text-aura-bg shadow-gold-glow hover:bg-aura-goldLight transition-colors"
                >
                  Explore Artisan Menu
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="glass-card p-3.5 rounded-2xl border border-aura-border flex gap-3.5 items-center"
                >
                  {/* Image */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-aura-border/60 shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-semibold text-aura-cream truncate">
                      {item.product.name}
                    </h5>
                    <p className="text-[11px] text-aura-gold font-medium mb-1">
                      {item.size.name} • {item.size.volume}
                    </p>
                    <div className="text-xs font-semibold text-aura-cream">
                      {formatINR(item.unitPrice * item.quantity)}
                    </div>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-aura-muted hover:text-red-400 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2 bg-aura-bg px-2 py-1 rounded-lg border border-aura-border">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-aura-muted hover:text-aura-cream transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-semibold text-aura-cream w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-aura-muted hover:text-aura-cream transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-aura-border bg-aura-bg/80 space-y-3">
              <div className="space-y-1.5 text-xs text-aura-muted">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-aura-cream font-medium">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Café GST (5%)</span>
                  <span className="text-aura-cream font-medium">{formatINR(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Packaging & Care</span>
                  <span className="text-aura-cream font-medium">
                    {packaging === 0 ? (
                      <span className="text-emerald-400 font-semibold uppercase text-[10px]">
                        Complimentary
                      </span>
                    ) : (
                      formatINR(packaging)
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-aura-border flex justify-between text-sm font-serif font-bold text-aura-cream">
                  <span>Total Amount</span>
                  <span className="text-aura-gold text-base">{formatINR(grandTotal)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCheckoutDemoOpen(true)}
                className="w-full py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-aura-gold text-aura-bg shadow-gold-glow hover:bg-aura-goldLight transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
              >
                <span>Proceed to Demo Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-[10px] text-center text-aura-muted flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-aura-gold" />
                Demo Mode — No real monetary transaction occurs.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ================= DEMO CHECKOUT MODAL ================= */}
      {isCheckoutDemoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-aura-gold/40 shadow-2xl relative">
            <button
              onClick={resetCheckoutModal}
              className="absolute top-4 right-4 text-aura-muted hover:text-aura-cream p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {!demoOrderPlaced ? (
              <div>
                <div className="w-12 h-12 rounded-2xl bg-aura-card border border-aura-gold/30 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-aura-gold" />
                </div>
                <h3 className="text-xl font-serif font-bold text-aura-cream mb-1">
                  Demo Checkout Experience
                </h3>
                <p className="text-xs text-aura-muted leading-relaxed mb-4">
                  This portfolio showcase operates in functional demonstration mode. To connect real payment processing (e.g. Razorpay, Stripe, UPI Gateway), configure backend API credentials in your environment.
                </p>

                <div className="p-4 rounded-xl bg-aura-bg/80 border border-aura-border mb-5 text-xs space-y-2">
                  <div className="flex justify-between text-aura-muted">
                    <span>Order Summary:</span>
                    <span className="text-aura-cream font-medium">
                      {items.reduce((sum, i) => sum + i.quantity, 0)} items
                    </span>
                  </div>
                  <div className="flex justify-between text-aura-muted">
                    <span>Total Payable:</span>
                    <span className="text-aura-gold font-bold text-sm">
                      {formatINR(grandTotal)}
                    </span>
                  </div>
                  <div className="text-[11px] text-aura-goldLight pt-1 border-t border-white/5">
                    Mode: Sandbox Simulation (Zero charges)
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={resetCheckoutModal}
                    className="flex-1 py-3 rounded-full text-xs font-semibold border border-aura-border hover:bg-white/5 text-aura-cream transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulateDemoCheckout}
                    className="flex-1 py-3 rounded-full text-xs font-semibold bg-aura-gold text-aura-bg hover:bg-aura-goldLight shadow-gold-glow transition-all"
                  >
                    Confirm Demo Order
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-2 space-y-4">
                {/* Header with Order Code and Live Indicator */}
                <div className="flex items-center justify-between pb-3 border-b border-aura-border">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                        Live Barista Tracker
                      </span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-aura-cream mt-0.5">
                      Order {orderCode}
                    </h3>
                  </div>

                  <span className="text-[10px] font-semibold text-aura-gold px-2.5 py-1 rounded-full bg-aura-gold/15 border border-aura-gold/30">
                    Demo Order Simulated!
                  </span>
                </div>

                {/* Multi-stage Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-aura-muted mb-2">
                    <span>Preparation Flow</span>
                    <span className="text-aura-cream font-medium">
                      Stage {trackerStage + 1} of 4
                    </span>
                  </div>

                  {/* Visual Step Progress Line */}
                  <div className="relative h-1.5 w-full bg-aura-card rounded-full overflow-hidden mb-3 border border-aura-border">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-aura-gold to-amber-300 transition-all duration-700 ease-out shadow-gold-glow"
                      style={{ width: `${((trackerStage + 1) / 4) * 100}%` }}
                    />
                  </div>

                  {/* Step Beads */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {TRACKER_STAGES.map((stg, idx) => {
                      const isPassed = trackerStage > idx;
                      const isCurrent = trackerStage === idx;
                      return (
                        <button
                          key={stg.step}
                          type="button"
                          onClick={() => setTrackerStage(idx)}
                          className={`p-1.5 rounded-xl border text-center transition-all ${
                            isCurrent
                              ? 'border-aura-gold bg-aura-gold/20 text-aura-cream ring-1 ring-aura-gold/50'
                              : isPassed
                              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                              : 'border-aura-border bg-aura-card/40 text-aura-muted hover:border-aura-gold/30'
                          }`}
                        >
                          <div className="flex items-center justify-center mb-0.5">
                            {isPassed ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <span className="text-[10px] font-bold">0{stg.step}</span>
                            )}
                          </div>
                          <div className="text-[9px] font-semibold truncate leading-tight">
                            {stg.title.split(' ')[0]}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Stage Highlight Card */}
                <div className="p-4 rounded-2xl bg-aura-bg/90 border border-aura-gold/30 shadow-inner">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-aura-card border border-aura-gold/40 flex items-center justify-center shrink-0 text-aura-gold">
                      {trackerStage === 0 && <Clock className="w-4 h-4" />}
                      {trackerStage === 1 && <Flame className="w-4 h-4" />}
                      {trackerStage === 2 && <Coffee className="w-4 h-4" />}
                      {trackerStage === 3 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-aura-cream">
                          {TRACKER_STAGES[trackerStage].title}
                        </h4>
                        {trackerStage === 3 ? (
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                            Ready
                          </span>
                        ) : (
                          <span className="text-[10px] text-aura-gold font-mono animate-pulse">
                            In Progress...
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-aura-muted leading-relaxed mt-1">
                        {TRACKER_STAGES[trackerStage].description}
                      </p>
                      <div className="text-[10px] text-aura-goldLight/80 font-mono mt-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-aura-gold" />
                        <span>{TRACKER_STAGES[trackerStage].station}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Summary Snapshot */}
                {orderSnapshot.length > 0 && (
                  <div className="p-3 rounded-xl bg-aura-card/50 border border-aura-border text-xs">
                    <div className="text-[10px] uppercase font-bold text-aura-muted tracking-wider mb-2">
                      Order Basket ({orderSnapshot.reduce((a, b) => a + b.quantity, 0)} items)
                    </div>
                    <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                      {orderSnapshot.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-xs">
                          <span className="text-aura-cream truncate max-w-[200px]">
                            {item.quantity}x {item.product.name} ({item.size.name})
                          </span>
                          <span className="text-aura-gold font-medium">
                            {formatINR(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={resetCheckoutModal}
                    className="flex-1 py-2.5 rounded-full text-xs font-semibold border border-aura-border hover:bg-white/5 text-aura-cream transition-colors"
                  >
                    Close Tracker
                  </button>
                  <button
                    type="button"
                    onClick={resetCheckoutModal}
                    className="flex-1 py-2.5 rounded-full text-xs font-semibold bg-aura-gold text-aura-bg hover:bg-aura-goldLight shadow-gold-glow transition-all flex items-center justify-center gap-1"
                  >
                    <span>Pick Up & Done</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
