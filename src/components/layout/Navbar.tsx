import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Coffee, ShoppingBag, Menu as MenuIcon, X, Calendar, Compass } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const location = useLocation();
  const { openCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change & handle body scroll lock
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Menu', path: '/menu' },
    { label: '3D Sanctuary', path: '/experience', highlight: true },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Reservations', path: '/reservations' },
    { label: 'Contact', path: '/contact' },
    { label: 'Case Study', path: '/case-study' },
  ];

  return (
    <>
      {/* Top Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[2.5px] bg-gradient-to-r from-aura-gold via-aura-goldLight to-aura-cream z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-aura-bg/90 backdrop-blur-xl border-b border-aura-border/80 shadow-2xl py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            className="group flex items-center gap-3 transition-transform active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aura-card to-aura-coffee border border-aura-gold/40 flex items-center justify-center shadow-gold-glow group-hover:border-aura-gold transition-colors">
              <Coffee className="w-5 h-5 text-aura-gold group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold tracking-widest text-aura-cream group-hover:text-aura-gold transition-colors">
                  AURA ROAST
                </span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded tracking-wider bg-aura-gold/15 text-aura-gold border border-aura-gold/30 font-semibold hidden sm:inline-block">
                  Reserve
                </span>
              </div>
              <p className="text-[10px] tracking-widest uppercase text-aura-muted">
                Crafted by AesthenixTech
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-aura-card/60 backdrop-blur-md border border-aura-border">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                    isActive
                      ? 'text-aura-bg bg-aura-gold font-semibold shadow-gold-glow'
                      : link.highlight
                      ? 'text-aura-gold hover:text-aura-cream hover:bg-white/5'
                      : 'text-aura-cream/80 hover:text-aura-cream hover:bg-white/5'
                  }`}
                >
                  {link.highlight && !isActive && (
                    <Compass className="w-3.5 h-3.5 inline mr-1 text-aura-gold animate-spin-slow" />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Book Table Button (Desktop) */}
            <Link
              to="/reservations"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase bg-aura-card hover:bg-aura-coffee text-aura-cream border border-aura-border hover:border-aura-gold transition-all shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5 text-aura-gold" />
              <span>Reserve Table</span>
            </Link>

            {/* Shopping Cart Button */}
            <button
              type="button"
              onClick={openCart}
              className="relative p-2.5 rounded-full bg-aura-card hover:bg-aura-cardHover border border-aura-border hover:border-aura-gold/40 text-aura-cream transition-all group"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 text-aura-gold group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-aura-gold text-aura-bg text-[11px] font-bold flex items-center justify-center shadow-gold-glow animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-full bg-aura-card border border-aura-border text-aura-cream hover:text-aura-gold transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ================= MOBILE NAVIGATION DRAWER ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute top-20 left-4 right-4 bg-aura-card border border-aura-gold/30 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between ${
                      isActive
                        ? 'bg-aura-gold text-aura-bg font-semibold'
                        : 'text-aura-cream hover:bg-white/5'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.highlight && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-aura-gold/20 text-aura-gold border border-aura-gold/30">
                        3D View
                      </span>
                    )}
                  </Link>
                );
              })}

              <div className="pt-4 mt-2 border-t border-aura-border flex flex-col gap-3">
                <Link
                  to="/reservations"
                  className="w-full py-3 rounded-xl text-center text-xs font-semibold uppercase tracking-wider bg-aura-gold text-aura-bg shadow-gold-glow"
                >
                  Book A Table
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
