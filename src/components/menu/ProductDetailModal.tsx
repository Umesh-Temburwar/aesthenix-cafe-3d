import React, { useState } from 'react';
import { X, Star, Clock, Flame, ShieldAlert, Plus, Check } from 'lucide-react';
import { Product, ProductSize } from '../../types';
import { useCartStore } from '../../stores/useCartStore';
import { formatINR } from '../../utils/format';
import { CoffeeShowcaseScene } from '../../scenes/CoffeeShowcase/CoffeeShowcaseScene';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<ProductSize>(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [viewMode, setViewMode] = useState<'3d' | 'photo'>('3d');

  const { addItem } = useCartStore();

  const currentPrice = Math.round(product.price * selectedSize.priceMultiplier);

  const handleAddToCart = () => {
    addItem(product, selectedSize, quantity);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl glass-card rounded-3xl border border-aura-gold/30 shadow-2xl overflow-hidden z-10 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-aura-card/80 border border-aura-border text-aura-muted hover:text-aura-cream transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Visual (3D Cup or Photography) */}
          <div className="relative bg-aura-card/60 min-h-[320px] md:min-h-[460px] flex items-center justify-center border-b md:border-b-0 md:border-r border-aura-border">
            {viewMode === '3d' ? (
              <div className="w-full h-full min-h-[320px]">
                <CoffeeShowcaseScene product={product} />
              </div>
            ) : (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}

            {/* Toggle 3D / Photo Mode */}
            <div className="absolute top-4 left-4 z-10 flex gap-1 p-1 rounded-full bg-aura-bg/80 border border-aura-border backdrop-blur-md">
              <button
                type="button"
                onClick={() => setViewMode('3d')}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                  viewMode === '3d'
                    ? 'bg-aura-gold text-aura-bg shadow-sm'
                    : 'text-aura-muted hover:text-aura-cream'
                }`}
              >
                3D Model
              </button>
              <button
                type="button"
                onClick={() => setViewMode('photo')}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                  viewMode === 'photo'
                    ? 'bg-aura-gold text-aura-bg shadow-sm'
                    : 'text-aura-muted hover:text-aura-cream'
                }`}
              >
                Photography
              </button>
            </div>
          </div>

          {/* Right Column: Details & Ordering */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Badge */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-aura-gold px-2 py-0.5 rounded-full bg-aura-gold/15 border border-aura-gold/30">
                  {product.category}
                </span>
                {product.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-aura-cream px-2 py-0.5 rounded-full bg-aura-coffee/60 border border-aura-border">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Title & Tagline */}
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-aura-cream mb-1">
                {product.name}
              </h3>
              <p className="text-xs text-aura-goldLight italic mb-3">
                "{product.tagline}"
              </p>

              {/* Rating & Prep stats */}
              <div className="flex items-center gap-4 text-xs text-aura-muted mb-4 pb-3 border-b border-aura-border">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-aura-muted">({product.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-aura-gold" />
                  <span>{product.prepTime}</span>
                </div>
                {product.roastLevel && (
                  <div className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-aura-gold" />
                    <span>{product.roastLevel}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-aura-cream/80 leading-relaxed mb-4">
                {product.longDescription || product.description}
              </p>

              {/* Origin Terroir */}
              {product.origin && (
                <div className="mb-4 text-xs">
                  <span className="text-aura-muted">Origin Terroir: </span>
                  <span className="text-aura-cream font-medium">{product.origin}</span>
                </div>
              )}

              {/* Size Selection */}
              <div className="mb-5">
                <label className="block text-xs uppercase font-semibold tracking-wider text-aura-muted mb-2">
                  Select Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize.name === size.name;
                    return (
                      <button
                        key={size.name}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`p-2 rounded-xl text-left border transition-all ${
                          isSelected
                            ? 'border-aura-gold bg-aura-gold/15 text-aura-cream shadow-sm'
                            : 'border-aura-border bg-aura-bg/50 text-aura-muted hover:border-aura-gold/40'
                        }`}
                      >
                        <div className="text-xs font-semibold">{size.name}</div>
                        <div className="text-[10px] opacity-75">{size.volume}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Price & Add Action */}
            <div className="pt-4 border-t border-aura-border flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-aura-muted block">
                  Price
                </span>
                <span className="font-serif text-2xl font-bold text-aura-gold">
                  {formatINR(currentPrice * quantity)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addedNotice}
                className={`flex-1 py-3 px-6 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  addedNotice
                    ? 'bg-emerald-500 text-white'
                    : 'bg-aura-gold text-aura-bg shadow-gold-glow hover:bg-aura-goldLight'
                }`}
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
