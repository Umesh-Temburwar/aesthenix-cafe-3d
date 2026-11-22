import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, MapPin, Phone, Mail, Clock, Instagram, Twitter, Facebook, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const agencyUrl = import.meta.env.VITE_AGENCY_URL || 'https://github.com/aesthenixtech';
  const agencyName = import.meta.env.VITE_AGENCY_NAME || 'AesthenixTech';

  return (
    <footer className="relative bg-[#0B0807] border-t border-aura-border/80 pt-16 pb-12 overflow-hidden text-aura-cream">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-aura-gold/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-aura-card border border-aura-gold/40 flex items-center justify-center shadow-gold-glow">
                <Coffee className="w-5 h-5 text-aura-gold" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-widest text-aura-cream">
                  AURA ROAST
                </span>
                <p className="text-[10px] tracking-widest uppercase text-aura-gold">
                  Reserve Coffee Roasters
                </p>
              </div>
            </Link>
            <p className="text-sm text-aura-muted leading-relaxed max-w-sm mb-6">
              "Where Every Sip Becomes an Experience." An immersive culinary sanctuary marrying single-origin precision roasting with architectural serenity.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Facebook, href: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-9 h-9 rounded-full bg-aura-card border border-aura-border hover:border-aura-gold text-aura-cream hover:text-aura-gold flex items-center justify-center transition-colors shadow-sm"
                  aria-label="Social Link"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Experience Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-aura-cream mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-aura-muted">
              <li>
                <Link to="/menu" className="hover:text-aura-gold transition-colors">
                  Artisan Menu
                </Link>
              </li>
              <li>
                <Link to="/experience" className="hover:text-aura-gold transition-colors text-aura-goldLight font-medium">
                  3D Sanctuary Tour
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-aura-gold transition-colors">
                  Atmosphere Gallery
                </Link>
              </li>
              <li>
                <Link to="/reservations" className="hover:text-aura-gold transition-colors">
                  Table Reservations
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-aura-gold transition-colors">
                  Location & Hours
                </Link>
              </li>
              <li>
                <Link to="/case-study" className="hover:text-aura-gold transition-colors text-aura-gold flex items-center gap-1">
                  <span>Agency Case Study</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-aura-gold/20 text-aura-gold uppercase font-mono">
                    3D
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-aura-cream mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-aura-gold" />
              Hours
            </h4>
            <ul className="space-y-2 text-xs text-aura-muted">
              <li className="flex justify-between py-1 border-b border-white/5">
                <span>Mon – Fri</span>
                <span className="text-aura-cream font-medium">7:00 AM – 10:30 PM</span>
              </li>
              <li className="flex justify-between py-1 border-b border-white/5">
                <span>Saturday</span>
                <span className="text-aura-cream font-medium">7:30 AM – 11:30 PM</span>
              </li>
              <li className="flex justify-between py-1">
                <span>Sunday</span>
                <span className="text-aura-cream font-medium">8:00 AM – 11:00 PM</span>
              </li>
              <li className="pt-2 text-[11px] text-aura-gold">
                * Evening Tasting Sessions daily at 6:00 PM
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-aura-cream mb-4">
              Sanctuary
            </h4>
            <ul className="space-y-3 text-xs text-aura-muted">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-aura-gold shrink-0 mt-0.5" />
                <span>42 Heritage Boulevard, Bandra West, Mumbai 400050 <em className="block text-[10px] text-aura-gold/80 mt-0.5">(Portfolio Showcase Flagship)</em></span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-aura-gold shrink-0" />
                <span>+91 (022) 8492-3300 <span className="text-[10px] text-aura-muted">(Demo)</span></span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-aura-gold shrink-0" />
                <span>concierge@auraroast.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Agency Credit and Copyright */}
        <div className="pt-8 border-t border-aura-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-aura-muted">
          <p>© {new Date().getFullYear()} AURA ROAST. All rights reserved.</p>

          <div className="flex items-center gap-1.5">
            <span>Digital Experience Crafted by</span>
            <a
              href={agencyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-aura-gold hover:text-aura-cream font-medium transition-colors inline-flex items-center gap-1 border-b border-aura-gold/40 hover:border-aura-gold"
            >
              {agencyName}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
