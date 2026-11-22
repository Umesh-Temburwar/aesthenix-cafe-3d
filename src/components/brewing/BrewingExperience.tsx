import React, { useState, useEffect } from 'react';
import { BREWING_METHODS } from '../../data/brewing';
import { BrewingMethod } from '../../types';
import { BaristaStationScene } from '../../scenes/BaristaStation/BaristaStationScene';
import { Flame, Droplets, Coffee, Snowflake, Clock, Scale, Thermometer, Play, Pause, RotateCcw, ChevronRight, Check, Gauge, Sparkles, BookOpen } from 'lucide-react';

export const BrewingExperience: React.FC = () => {
  const [activeExperience, setActiveExperience] = useState<'3d-barista' | 'manual-methods'>('3d-barista');
  const [selectedMethod, setSelectedMethod] = useState<BrewingMethod>(BREWING_METHODS[0]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [stepProgress, setStepProgress] = useState<number>(0);

  // Reset steps when method switches
  const handleSelectMethod = (method: BrewingMethod) => {
    setSelectedMethod(method);
    setActiveStepIndex(0);
    setStepProgress(0);
    setIsPlaying(false);
  };

  // Step timer & progress
  useEffect(() => {
    let interval: number | null = null;
    if (isPlaying) {
      const currentStep = selectedMethod.steps[activeStepIndex];
      const durationMs = currentStep.durationSeconds * 1000;
      const stepInterval = 50; // update every 50ms
      const increment = (stepInterval / durationMs) * 100;

      interval = window.setInterval(() => {
        setStepProgress((prev) => {
          if (prev >= 100) {
            // Advance to next step or pause
            if (activeStepIndex < selectedMethod.steps.length - 1) {
              setActiveStepIndex((curr) => curr + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + increment;
        });
      }, stepInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, activeStepIndex, selectedMethod]);

  const getMethodIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-5 h-5 text-amber-500" />;
      case 'Droplets': return <Droplets className="w-5 h-5 text-blue-400" />;
      case 'Coffee': return <Coffee className="w-5 h-5 text-aura-gold" />;
      case 'Snowflake': return <Snowflake className="w-5 h-5 text-cyan-400" />;
      default: return <Coffee className="w-5 h-5 text-aura-gold" />;
    }
  };

  const currentStep = selectedMethod.steps[activeStepIndex];

  return (
    <div className="glass-card rounded-3xl border border-aura-gold/30 p-6 md:p-10 shadow-2xl overflow-hidden">
      {/* Top Experience Switcher (3D Barista Station vs Manual Timers) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-aura-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-aura-gold/15 border border-aura-gold/30 text-[10px] uppercase font-bold tracking-widest text-aura-gold mb-2">
            <Sparkles className="w-3 h-3 text-aura-gold" />
            <span>Interactive Roastery Science</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-aura-cream">
            The Barista <span className="gold-gradient-text italic font-normal">Extraction Lab</span>
          </h3>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-full bg-aura-card border border-aura-border text-xs">
          <button
            type="button"
            onClick={() => setActiveExperience('3d-barista')}
            className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
              activeExperience === '3d-barista'
                ? 'bg-aura-gold text-aura-bg font-semibold shadow-gold-glow'
                : 'text-aura-muted hover:text-aura-cream'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>3D Barista Simulator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveExperience('manual-methods')}
            className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
              activeExperience === 'manual-methods'
                ? 'bg-aura-gold text-aura-bg font-semibold shadow-gold-glow'
                : 'text-aura-muted hover:text-aura-cream'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Manual Brew Rituals</span>
          </button>
        </div>
      </div>

      {activeExperience === '3d-barista' ? (
        <div className="w-full h-[620px] rounded-3xl overflow-hidden shadow-2xl border border-aura-gold/30">
          <BaristaStationScene showControlsOverlay={true} />
        </div>
      ) : (
        <>
          {/* Top Method Selector Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {BREWING_METHODS.map((method) => {
          const isSelected = selectedMethod.id === method.id;
          return (
            <button
              key={method.id}
              onClick={() => handleSelectMethod(method)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-aura-card border-aura-gold shadow-gold-glow scale-[1.02]'
                  : 'bg-aura-surface/60 border-aura-border hover:border-aura-gold/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-aura-bg border border-aura-border">
                  {getMethodIcon(method.iconName)}
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-aura-gold">
                  {method.difficulty}
                </span>
              </div>
              <h4 className="font-serif text-lg font-bold text-aura-cream">
                {method.name}
              </h4>
              <p className="text-xs text-aura-muted line-clamp-1 mt-0.5">
                {method.tagline}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Equipment & Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-aura-gold px-2.5 py-1 rounded-full bg-aura-gold/15 border border-aura-gold/30 inline-block mb-3">
              Craft Extraction Parameters
            </span>
            <h3 className="font-serif text-3xl font-bold text-aura-cream mb-2">
              {selectedMethod.name}
            </h3>
            <p className="text-xs text-aura-muted leading-relaxed">
              {selectedMethod.description}
            </p>
          </div>

          {/* Metric Badges Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-3 rounded-xl border border-aura-border">
              <div className="text-[10px] text-aura-muted flex items-center gap-1.5 uppercase font-semibold">
                <Scale className="w-3.5 h-3.5 text-aura-gold" />
                Brew Ratio
              </div>
              <div className="text-sm font-semibold text-aura-cream mt-1">
                {selectedMethod.coffeeRatio}
              </div>
            </div>

            <div className="glass-card p-3 rounded-xl border border-aura-border">
              <div className="text-[10px] text-aura-muted flex items-center gap-1.5 uppercase font-semibold">
                <Thermometer className="w-3.5 h-3.5 text-aura-gold" />
                Water Temp
              </div>
              <div className="text-sm font-semibold text-aura-cream mt-1">
                {selectedMethod.waterTemp}
              </div>
            </div>

            <div className="glass-card p-3 rounded-xl border border-aura-border">
              <div className="text-[10px] text-aura-muted flex items-center gap-1.5 uppercase font-semibold">
                <Clock className="w-3.5 h-3.5 text-aura-gold" />
                Extraction Time
              </div>
              <div className="text-sm font-semibold text-aura-cream mt-1">
                {selectedMethod.totalTime}
              </div>
            </div>

            <div className="glass-card p-3 rounded-xl border border-aura-border">
              <div className="text-[10px] text-aura-muted flex items-center gap-1.5 uppercase font-semibold">
                <Coffee className="w-3.5 h-3.5 text-aura-gold" />
                Grind Size
              </div>
              <div className="text-sm font-semibold text-aura-cream mt-1">
                {selectedMethod.grindSize}
              </div>
            </div>
          </div>

          {/* Tasting Notes */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-aura-muted mb-2">
              Terroir Tasting Profile
            </h5>
            <div className="flex flex-wrap gap-2">
              {selectedMethod.tastingNotes.map((note, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full text-xs bg-aura-card border border-aura-border text-aura-goldLight"
                >
                  ✦ {note}
                </span>
              ))}
            </div>
          </div>

          {/* Barista Equipment */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-aura-muted mb-2">
              Barista Gear Required
            </h5>
            <ul className="space-y-1.5 text-xs text-aura-cream/80">
              {selectedMethod.equipment.map((eq, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-aura-gold" />
                  <span>{eq}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Step-by-Step Interactive Timeline (7 cols) */}
        <div className="lg:col-span-7 bg-aura-bg/80 border border-aura-border rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-aura-gold text-aura-bg text-xs font-bold flex items-center justify-center">
                {activeStepIndex + 1}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-aura-gold">
                Step {activeStepIndex + 1} of {selectedMethod.steps.length}
              </span>
            </div>

            {/* Play/Pause Simulator Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setStepProgress(0);
                  setActiveStepIndex(0);
                  setIsPlaying(false);
                }}
                className="p-2 rounded-full border border-aura-border text-aura-muted hover:text-aura-cream hover:bg-white/5 transition-colors"
                title="Restart Brewing Guide"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-aura-gold text-aura-bg hover:bg-aura-goldLight shadow-gold-glow transition-all flex items-center gap-1.5"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Flow</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>{stepProgress >= 100 ? 'Replay Flow' : 'Auto Play Flow'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Active Step Highlight Card */}
          <div className="glass-card p-6 rounded-2xl border border-aura-gold/30 mb-6 relative overflow-hidden">
            {/* Step Progress Fill Line */}
            <div
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-aura-gold to-aura-goldLight transition-all duration-100"
              style={{ width: `${stepProgress}%` }}
            />

            <h4 className="font-serif text-2xl font-bold text-aura-cream mb-2">
              {currentStep.title}
            </h4>
            <p className="text-sm text-aura-cream/90 leading-relaxed mb-4">
              {currentStep.instruction}
            </p>
            <div className="text-xs text-aura-muted flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-aura-gold" />
              <span>Step duration: ~{currentStep.durationSeconds} seconds</span>
            </div>
          </div>

          {/* Step Navigation Pill List */}
          <div className="space-y-2.5">
            {selectedMethod.steps.map((st, idx) => {
              const isCurrent = idx === activeStepIndex;
              const isDone = idx < activeStepIndex;
              return (
                <button
                  key={st.step}
                  onClick={() => {
                    setActiveStepIndex(idx);
                    setStepProgress(0);
                    setIsPlaying(false);
                  }}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isCurrent
                      ? 'border-aura-gold bg-aura-gold/15 text-aura-cream'
                      : 'border-aura-border bg-aura-surface/40 text-aura-muted hover:border-aura-gold/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                        isDone
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-aura-gold text-aura-bg'
                          : 'bg-aura-card text-aura-muted'
                      }`}
                    >
                      {isDone ? <Check className="w-3.5 h-3.5" /> : st.step}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-aura-cream">{st.title}</div>
                      <div className="text-[11px] text-aura-muted line-clamp-1">{st.instruction}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-aura-muted" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
      </>
    )}
    </div>
  );
};
