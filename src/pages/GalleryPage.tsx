import React, { useState, useEffect } from 'react';
import { GALLERY_ITEMS } from '../data/gallery';
import { GalleryItem } from '../types';
import { X, ChevronLeft, ChevronRight, Eye, Sparkles } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const filteredItems = activeCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeItem) return;

      if (e.key === 'Escape') {
        setActiveItem(null);
      } else if (e.key === 'ArrowRight') {
        const currIdx = filteredItems.findIndex((i) => i.id === activeItem.id);
        const nextIdx = (currIdx + 1) % filteredItems.length;
        setActiveItem(filteredItems[nextIdx]);
      } else if (e.key === 'ArrowLeft') {
        const currIdx = filteredItems.findIndex((i) => i.id === activeItem.id);
        const prevIdx = (currIdx - 1 + filteredItems.length) % filteredItems.length;
        setActiveItem(filteredItems[prevIdx]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeItem, filteredItems]);

  const categories = [
    { id: 'all', label: 'All Perspectives' },
    { id: 'interior', label: 'Sanctuary Interior' },
    { id: 'brewing', label: 'Extraction Science' },
    { id: 'beverage', label: 'Artisan Beverages' },
    { id: 'patisserie', label: 'Viennoiserie' },
  ];

  return (
    <div className="pt-28 pb-24 min-h-screen bg-aura-bg">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] uppercase font-bold tracking-widest text-aura-gold px-3 py-1 rounded-full bg-aura-gold/15 border border-aura-gold/30 inline-block mb-3">
            Visual Anthology
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-aura-cream mb-4">
            The Atmosphere <span className="gold-gradient-text italic font-normal">Gallery</span>
          </h1>
          <p className="text-xs sm:text-sm text-aura-muted leading-relaxed">
            A photographic tour through our architectural spaces, precision extractions, and culinary craft.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-aura-gold text-aura-bg shadow-gold-glow'
                    : 'bg-aura-card border border-aura-border text-aura-muted hover:text-aura-cream hover:border-aura-gold/40'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Masonry / Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative rounded-3xl overflow-hidden border border-aura-border bg-aura-card cursor-pointer shadow-lg hover:border-aura-gold/50 transition-all duration-500 h-80"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-aura-bg via-aura-bg/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                <span className="text-[10px] uppercase font-bold tracking-wider text-aura-gold mb-1">
                  {item.category}
                </span>
                <h3 className="font-serif text-xl font-bold text-aura-cream mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-aura-cream/80 line-clamp-2 mb-3">
                  {item.caption}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-aura-gold font-medium">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Click to expand</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= FULLSCREEN LIGHTBOX MODAL ================= */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
          {/* Close button */}
          <button
            onClick={() => setActiveItem(null)}
            className="absolute top-6 right-6 z-20 p-3 rounded-full bg-aura-card/80 border border-aura-border text-aura-muted hover:text-aura-cream transition-colors"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const currIdx = filteredItems.findIndex((i) => i.id === activeItem.id);
              const prevIdx = (currIdx - 1 + filteredItems.length) % filteredItems.length;
              setActiveItem(filteredItems[prevIdx]);
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-aura-card/80 border border-aura-border text-aura-muted hover:text-aura-cream hover:border-aura-gold transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const currIdx = filteredItems.findIndex((i) => i.id === activeItem.id);
              const nextIdx = (currIdx + 1) % filteredItems.length;
              setActiveItem(filteredItems[nextIdx]);
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-aura-card/80 border border-aura-border text-aura-muted hover:text-aura-cream hover:border-aura-gold transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Content */}
          <div className="max-w-4xl w-full flex flex-col items-center">
            <div className="max-h-[72vh] rounded-3xl overflow-hidden border border-aura-gold/40 shadow-2xl mb-4">
              <img
                src={activeItem.imageUrl}
                alt={activeItem.title}
                className="max-h-[72vh] w-auto object-contain mx-auto"
              />
            </div>
            <div className="text-center max-w-lg">
              <span className="text-[10px] uppercase font-bold tracking-widest text-aura-gold px-2.5 py-0.5 rounded-full bg-aura-gold/15 border border-aura-gold/30 inline-block mb-1">
                {activeItem.category}
              </span>
              <h3 className="font-serif text-2xl font-bold text-aura-cream mb-1">
                {activeItem.title}
              </h3>
              <p className="text-xs text-aura-muted">
                {activeItem.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
