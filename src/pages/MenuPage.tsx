import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { ProductCategory, Product } from '../types';
import { ProductDetailModal } from '../components/menu/ProductDetailModal';
import { CupCustomizerScene } from '../scenes/CupCustomizer/CupCustomizerScene';
import { useCartStore } from '../stores/useCartStore';
import { formatINR } from '../utils/format';
import { Search, Filter, Star, Plus, Check, Sparkles, Coffee, Palette } from 'lucide-react';

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'all', label: 'All Offerings' },
  { id: 'hot', label: 'Hot Coffee' },
  { id: 'cold', label: 'Cold Brews' },
  { id: 'specialty', label: 'Specialty Reserve' },
  { id: 'tea', label: 'Matcha & Botanicals' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'bakery', label: 'Viennoiserie' },
  { id: 'snacks', label: 'Savory Snacks' },
];

export const MenuPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialView = searchParams.get('view') === 'customizer' ? 'customizer' : 'catalog';
  const [activeView, setActiveView] = useState<'catalog' | 'customizer'>(initialView);
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  const { addItem, openCart } = useCartStore();

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.origin && product.origin.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [activeCategory, searchQuery, sortBy]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, product.sizes[0], 1);
    setAddedItemNotice(product.id);
    setTimeout(() => {
      setAddedItemNotice(null);
    }, 1000);
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-aura-bg">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[10px] uppercase font-bold tracking-widest text-aura-gold px-3 py-1 rounded-full bg-aura-gold/15 border border-aura-gold/30 inline-block mb-3">
            Seasonal Selections & 3D Atelier
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-aura-cream mb-4">
            The Artisan <span className="gold-gradient-text italic font-normal">Café Menu</span>
          </h1>
          <p className="text-xs sm:text-sm text-aura-muted leading-relaxed">
            Every creation is prepared on demand with uncompromised dedication to origin, thermal control, and sensory balance.
          </p>

          {/* Dual Experience Mode Switcher */}
          <div className="mt-7 inline-flex items-center p-1.5 rounded-2xl bg-aura-card border border-aura-border shadow-lg">
            <button
              type="button"
              onClick={() => setActiveView('catalog')}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeView === 'catalog'
                  ? 'bg-aura-gold text-aura-bg shadow-gold-glow'
                  : 'text-aura-muted hover:text-aura-cream'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Artisan Roasts Catalog</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('customizer')}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeView === 'customizer'
                  ? 'bg-aura-gold text-aura-bg shadow-gold-glow'
                  : 'text-aura-muted hover:text-aura-cream'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>3D Bespoke Cup Studio</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-aura-cream/20 text-white uppercase font-mono">
                New
              </span>
            </button>
          </div>
        </div>

        {/* ================= CONDITIONAL CONTENT ================= */}
        {activeView === 'customizer' ? (
          <div className="mb-12">
            <CupCustomizerScene onAddedToCart={openCart} />
          </div>
        ) : (
          <>
            {/* Search & Sort Controls Bar */}
            <div className="glass-card p-4 rounded-2xl border border-aura-border mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Input */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-aura-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search roasts, origin terroir, notes..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-aura-bg/80 border border-aura-border text-xs text-aura-cream placeholder-aura-muted/50 focus:outline-none focus:border-aura-gold transition-colors"
                />
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <Filter className="w-3.5 h-3.5 text-aura-gold" />
                <span className="text-xs text-aura-muted">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-aura-bg border border-aura-border rounded-xl px-3 py-2 text-xs text-aura-cream focus:outline-none focus:border-aura-gold transition-colors"
                >
                  <option value="featured">Featured Roasts</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {CATEGORIES.map((cat) => {
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

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-3xl border border-aura-border">
            <Coffee className="w-12 h-12 text-aura-gold/40 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-aura-cream mb-1">
              No creations match your search
            </h3>
            <p className="text-xs text-aura-muted mb-4">
              Try adjusting your search terms or category filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-6 py-2 rounded-full text-xs font-semibold bg-aura-gold text-aura-bg shadow-gold-glow"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="group glass-card rounded-3xl border border-aura-border overflow-hidden cursor-pointer transition-all duration-300 hover:border-aura-gold/50 hover:shadow-gold-glow flex flex-col justify-between"
              >
                <div>
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-aura-card">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-aura-bg via-transparent to-transparent opacity-75" />

                    {product.badge && (
                      <span className="absolute top-3 left-3 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-aura-bg/80 text-aura-gold border border-aura-gold/30 backdrop-blur-md">
                        {product.badge}
                      </span>
                    )}

                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity px-2.5 py-1 rounded-full bg-aura-gold text-aura-bg text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>3D Preview</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs text-aura-muted mb-1.5">
                      <span className="uppercase tracking-wider text-[10px] font-semibold text-aura-gold">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-semibold text-aura-cream">{product.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-aura-cream group-hover:text-aura-gold transition-colors mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-aura-muted line-clamp-2 leading-relaxed mb-3">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Price and Add button */}
                <div className="p-5 pt-0 border-t border-white/5 flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-[10px] uppercase text-aura-muted block">Starts from</span>
                    <span className="font-serif text-lg font-bold text-aura-gold">
                      {formatINR(product.price)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(product, e)}
                    className={`p-2.5 rounded-full transition-all ${
                      addedItemNotice === product.id
                        ? 'bg-emerald-500 text-white'
                        : 'bg-aura-card border border-aura-border hover:border-aura-gold text-aura-cream hover:text-aura-gold hover:bg-aura-cardHover'
                    }`}
                    title="Quick Add to Bag"
                  >
                    {addedItemNotice === product.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
          </>
        )}
      </div>

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};
