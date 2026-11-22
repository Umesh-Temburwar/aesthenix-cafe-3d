import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ambientAudio, AmbientVibe } from '../utils/ambientAudio';

interface AmbientAudioState {
  isPlaying: boolean;
  volume: number;
  vibe: AmbientVibe;
  isExpanded: boolean;
  togglePlay: () => void;
  setVolume: (val: number) => void;
  setVibe: (vibe: AmbientVibe) => void;
  toggleExpanded: () => void;
}

export const useAmbientAudioStore = create<AmbientAudioState>()(
  persist(
    (set, get) => ({
      isPlaying: false,
      volume: 0.35,
      vibe: 'midnight-jazz',
      isExpanded: false,

      togglePlay: () => {
        const current = get().isPlaying;
        const next = !current;
        if (next) {
          ambientAudio.setVolume(get().volume);
          ambientAudio.setVibe(get().vibe);
          ambientAudio.start();
        } else {
          ambientAudio.stop();
        }
        set({ isPlaying: next });
      },

      setVolume: (val: number) => {
        const clamped = Math.max(0, Math.min(1, val));
        ambientAudio.setVolume(clamped);
        set({ volume: clamped });
      },

      setVibe: (vibe: AmbientVibe) => {
        ambientAudio.setVibe(vibe);
        set({ vibe });
      },

      toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
    }),
    {
      name: 'aura_ambient_audio',
      partialize: (state) => ({
        volume: state.volume,
        vibe: state.vibe,
      }),
    }
  )
);
