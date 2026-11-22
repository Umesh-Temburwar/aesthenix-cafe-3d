import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ChevronDown } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const faqs = [
    {
      q: 'Do you offer dairy-free and plant milk options?',
      a: 'Yes, we steam Minor Figures organic oat milk, house-pressed almond milk, and slow-roasted pistachio milk without supplemental surcharge.',
    },
    {
      q: 'Can I purchase roasted whole beans to take home?',
      a: 'Absolutely. All our single-origin lots and signature espresso blends are packaged with one-way degassing valves and roasted within 7 days of purchase.',
    },
    {
      q: 'Is there parking available on premises?',
      a: 'We offer complimentary valet parking at our 42 Heritage Boulevard entrance for all reserved guests.',
    },
    {
      q: 'What is the dress code?',
      a: 'Smart casual. We invite guests to enjoy an unhurried, comfortable experience.',
    },
  ];

  return (
    <div className="pt-28 pb-24 min-h-screen bg-aura-bg">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] uppercase font-bold tracking-widest text-aura-gold px-3 py-1 rounded-full bg-aura-gold/15 border border-aura-gold/30 inline-block mb-3">
            Concierge & Location (Portfolio Showcase Concept)
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-aura-cream mb-4">
            Connect With <span className="gold-gradient-text italic font-normal">Our Sanctuary</span>
          </h1>
          <p className="text-xs sm:text-sm text-aura-muted leading-relaxed">
            We welcome inquiries regarding private tastings, bean subscriptions, or visiting our Mumbai flagship roastery.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-start">
          {/* Contact Details & Interactive Map Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 md:p-8 rounded-3xl border border-aura-border space-y-6">
              <h3 className="font-serif text-2xl font-bold text-aura-cream">
                The Flagship Roastery
              </h3>

              <div className="space-y-4 text-xs text-aura-muted">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-aura-card border border-aura-border text-aura-gold shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-aura-cream text-sm">Physical Address</h5>
                    <p className="mt-0.5">42 Heritage Boulevard, Bandra West, Mumbai, Maharashtra 400050</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-aura-card border border-aura-border text-aura-gold shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-aura-cream text-sm">Concierge Hotline</h5>
                    <p className="mt-0.5">+91 (022) 8492-3300</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-aura-card border border-aura-border text-aura-gold shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-aura-cream text-sm">Digital Concierge</h5>
                    <p className="mt-0.5">concierge@auraroast.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-aura-card border border-aura-border text-aura-gold shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-aura-cream text-sm">Operating Hours</h5>
                    <p className="mt-0.5">Monday – Friday: 7:00 AM – 10:30 PM</p>
                    <p>Saturday – Sunday: 7:30 AM – 11:30 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stylized Architectural Location Display */}
            <div className="relative rounded-3xl overflow-hidden border border-aura-border h-64 bg-aura-surface">
              <img
                src="https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=800&q=80"
                alt="AURA ROAST Flagship Exterior"
                className="w-full h-full object-cover filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-aura-bg via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 glass-card p-3 rounded-xl border border-aura-gold/30 text-xs text-aura-cream flex items-center justify-between">
                <span>Heritage Boulevard District</span>
                <span className="text-[10px] text-aura-gold uppercase font-bold tracking-wider">
                  Valet Available
                </span>
              </div>
            </div>
          </div>

          {/* Concierge Message Form (7 cols) */}
          <div className="lg:col-span-7 glass-card p-6 md:p-10 rounded-3xl border border-aura-gold/30 shadow-2xl">
            <h3 className="font-serif text-2xl font-bold text-aura-cream mb-2">
              Send a Concierge Inquiry
            </h3>
            <p className="text-xs text-aura-muted mb-6">
              Our team responds to all guest inquiries within four business hours.
            </p>

            {formSent ? (
              <div className="py-12 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-2xl font-bold text-aura-cream mb-1">
                  Message Dispatched
                </h4>
                <p className="text-xs text-aura-muted">
                  Thank you for reaching out. Our concierge has received your message.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-semibold text-aura-cream mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Julian Vance"
                      className="w-full px-4 py-3 rounded-xl bg-aura-bg border border-aura-border text-xs text-aura-cream focus:outline-none focus:border-aura-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-semibold text-aura-cream mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="julian@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-aura-bg border border-aura-border text-xs text-aura-cream focus:outline-none focus:border-aura-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-aura-cream mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Private Tasting / Media Inquiry / Feedback"
                    className="w-full px-4 py-3 rounded-xl bg-aura-bg border border-aura-border text-xs text-aura-cream focus:outline-none focus:border-aura-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-aura-cream mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us how we may assist you..."
                    className="w-full px-4 py-3 rounded-xl bg-aura-bg border border-aura-border text-xs text-aura-cream focus:outline-none focus:border-aura-gold resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-aura-gold text-aura-bg hover:bg-aura-goldLight shadow-gold-glow transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Message</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="font-serif text-3xl font-bold text-aura-cream mb-2">
              Frequently Inquired
            </h3>
            <p className="text-xs text-aura-muted">
              Common questions regarding our roasting principles, reservations, and sanctuary amenities.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="glass-card rounded-2xl border border-aura-border overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-aura-cream"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-aura-gold transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-aura-muted leading-relaxed border-t border-white/5 pt-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
