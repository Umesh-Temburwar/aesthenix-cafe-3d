import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { BackToTop } from './components/common/BackToTop';
import { LoadingScreen } from './components/common/LoadingScreen';

// Pages
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { ExperiencePage } from './pages/ExperiencePage';
import { GalleryPage } from './pages/GalleryPage';
import { ReservationsPage } from './pages/ReservationsPage';
import { ContactPage } from './pages/ContactPage';
import { CaseStudyPage } from './pages/CaseStudyPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AmbientSoundscapePlayer } from './components/audio/AmbientSoundscapePlayer';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export const App: React.FC<{ skipInitialLoading?: boolean }> = ({ skipInitialLoading = false }) => {
  const [initialLoading, setInitialLoading] = useState(!skipInitialLoading);

  return (
    <div className="min-h-screen bg-aura-bg text-aura-cream flex flex-col selection:bg-aura-gold selection:text-aura-bg">
      {initialLoading && (
        <LoadingScreen onComplete={() => setInitialLoading(false)} />
      )}

      <ScrollToTop />
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/case-study" element={<CaseStudyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
      <CartDrawer />
      <AmbientSoundscapePlayer />
      <BackToTop />
    </div>
  );
};
