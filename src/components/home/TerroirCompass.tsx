import React, { useState } from 'react';
import { Globe, Mountain, Sparkles, Droplets, Calendar, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TerroirOrigin {
  id: string;
  country: string;
  region: string;
  estate: string;
  altitude: string;
  process: string;
  varietal: string;
  harvestWindow: string;
  directTradePremium: string;
  tastingNotes: string[];
  description: string;
  imageUrl: string;
}

const ORIGINS: TerroirOrigin[] = [
  {
    id: 'ethiopia',
    country: 'Ethiopia',
    region: 'Yirgacheffe / Gedeo Zone',
    estate: 'Konga Aylele Microlot',
    altitude: '2,100 - 2,250 MASL',
    process: 'Natural Anaerobic (72h fermentation)',
    varietal: 'Indigenous Heirloom',
    harvestWindow: 'November – January',
    directTradePremium: '+74% Above C-Market Base',
    tastingNotes: ['Wild Jasmine', 'Bergamot Citrus', 'Candied Peach', 'Honeysuckle'],
    description: 'Perched on high volcanic slopes in the birthplace of Arabica, this heirloom lot develops extraordinarily dense sugars due to extreme diurnal temperature swings.',
    imageUrl: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'colombia',
    country: 'Colombia',
    region: 'Huila / Pitalito Highlands',
    estate: 'Finca El Paraiso Reserve',
    altitude: '1,950 MASL',
    process: 'Double Anaerobic Washed',
    varietal: 'Pink Bourbon',
    harvestWindow: 'May – July & October – December',
    directTradePremium: '+68% Above C-Market Base',
    tastingNotes: ['Blood Orange', 'Dark Cocoa Nibs', 'Maraschino Cherry', 'Raw Cane Sugar'],
    description: 'Cultivated in the mineral-rich soils flanking the Magdalena River. The Pink Bourbon varietal yields crisp citric brightness balanced by buttery caramel body.',
    imageUrl: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'panama',
    country: 'Panama',
    region: 'Boquete / Baru Volcano',
    estate: 'Hacienda La Esmeralda Jaramillo',
    altitude: '1,800 - 1,950 MASL',
    process: 'Slow Honey Washed',
    varietal: 'Green-Tip Geisha',
    harvestWindow: 'January – April',
    directTradePremium: '+120% Direct Auction Lot',
    tastingNotes: ['White Orchid', 'Meyer Lemon', 'Earl Grey Tea', 'Wild Orange Blossom'],
    description: 'The pinnacle of specialty coffee competition coffees. Grown in the volcanic microclimate of Volcán Barú with ocean breezes from both the Pacific and Caribbean.',
    imageUrl: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sumatra',
    country: 'Indonesia',
    region: 'Sumatra / Lake Toba',
    estate: 'Lintong Nihuta Highlands',
    altitude: '1,550 - 1,700 MASL',
    process: 'Wet-Hulled (Giling Basah)',
    varietal: 'Ateng & Typica',
    harvestWindow: 'October – February',
    directTradePremium: '+55% Direct Organic Cooperative',
    tastingNotes: ['Madagascar Vanilla', 'Dark Molasses', 'Cedarwood', 'Earthy Dark Chocolate'],
    description: 'Traditional Indonesian wet-hulling yields unmatched viscous mouthfeel, deep earthy richness, and almost zero acidity—the foundation of our 24-hr Cold Brew.',
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80',
  },
];

export const TerroirCompass: React.FC = () => {
  const [selectedOrigin, setSelectedOrigin] = useState<TerroirOrigin>(ORIGINS[0]);

  return (
    <div className="glass-card rounded-3xl border border-aura-gold/30 p-6 md:p-10 shadow-2xl overflow-hidden">
      {/* Top Country Filter Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {ORIGINS.map((origin) => {
          const isSelected = selectedOrigin.id === origin.id;
          return (
            <button
              key={origin.id}
              onClick={() => setSelectedOrigin(origin)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-aura-card border-aura-gold shadow-gold-glow scale-[1.02]'
                  : 'bg-aura-surface/60 border-aura-border hover:border-aura-gold/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-aura-gold">
                  {origin.country}
                </span>
                <Globe className={`w-4 h-4 ${isSelected ? 'text-aura-gold' : 'text-aura-muted'}`} />
              </div>
              <h4 className="font-serif text-lg font-bold text-aura-cream">
                {origin.region.split('/')[0]}
              </h4>
              <p className="text-[11px] text-aura-muted line-clamp-1 mt-0.5">
                {origin.varietal}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Terroir Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Image & Altitude Card (5 cols) */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl overflow-hidden border border-aura-border h-80 bg-aura-card">
            <img
              src={selectedOrigin.imageUrl}
              alt={selectedOrigin.region}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-aura-bg via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 right-4 glass-card p-3 rounded-xl border border-aura-gold/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-aura-gold uppercase font-bold tracking-wider block">
                  Estate Microlot
                </span>
                <span className="text-xs text-aura-cream font-semibold font-serif">
                  {selectedOrigin.estate}
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                Ethical Trade
              </span>
            </div>
          </div>
        </div>

        {/* Right Terroir Profile Details (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-aura-gold px-2.5 py-0.5 rounded-full bg-aura-gold/15 border border-aura-gold/30">
                {selectedOrigin.country} Direct Harvest
              </span>
              <span className="text-xs text-aura-muted">•</span>
              <span className="text-xs text-aura-cream font-medium">
                {selectedOrigin.varietal}
              </span>
            </div>

            <h3 className="font-serif text-3xl font-bold text-aura-cream mb-2">
              {selectedOrigin.region}
            </h3>

            <p className="text-xs text-aura-muted leading-relaxed">
              {selectedOrigin.description}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="glass-card p-3 rounded-xl border border-aura-border">
              <div className="text-[10px] text-aura-muted flex items-center gap-1.5 uppercase font-semibold">
                <Mountain className="w-3.5 h-3.5 text-aura-gold" />
                Elevation
              </div>
              <div className="text-xs font-semibold text-aura-cream mt-1 truncate">
                {selectedOrigin.altitude}
              </div>
            </div>

            <div className="glass-card p-3 rounded-xl border border-aura-border">
              <div className="text-[10px] text-aura-muted flex items-center gap-1.5 uppercase font-semibold">
                <Droplets className="w-3.5 h-3.5 text-aura-gold" />
                Processing
              </div>
              <div className="text-xs font-semibold text-aura-cream mt-1 truncate">
                {selectedOrigin.process}
              </div>
            </div>

            <div className="glass-card p-3 rounded-xl border border-aura-border col-span-2 sm:col-span-1">
              <div className="text-[10px] text-aura-muted flex items-center gap-1.5 uppercase font-semibold">
                <Award className="w-3.5 h-3.5 text-aura-gold" />
                Farmer Premium
              </div>
              <div className="text-xs font-semibold text-emerald-400 mt-1 truncate">
                {selectedOrigin.directTradePremium}
              </div>
            </div>
          </div>

          {/* Tasting Notes */}
          <div>
            <h5 className="text-[11px] font-semibold uppercase tracking-wider text-aura-muted mb-2">
              Aromatic Flavor Terroir
            </h5>
            <div className="flex flex-wrap gap-2">
              {selectedOrigin.tastingNotes.map((note, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs bg-aura-card border border-aura-gold/30 text-aura-goldLight font-medium"
                >
                  ✦ {note}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-aura-gold hover:text-aura-cream transition-colors"
            >
              <span>Explore Roasts from {selectedOrigin.country}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
