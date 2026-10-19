import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Palette, Clock, RotateCcw, Sliders, Check, LayoutTemplate } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '../store/useStore';
import type { BackgroundTheme } from '../types';

interface ThemePreset {
  id: BackgroundTheme;
  name: string;
  previewColor: string;
  gradient: string;
}

const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    previewColor: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #6366f1)',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    previewColor: '#f43f5e',
    gradient: 'linear-gradient(135deg, #f43f5e, #8b5cf6)',
  },
  {
    id: 'deepspace',
    name: 'Deep Space',
    previewColor: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6, #1e1b4b)',
  },
  {
    id: 'sunset',
    name: 'Sunset Silk',
    previewColor: '#f97316',
    gradient: 'linear-gradient(135deg, #f97316, #ec4899)',
  },
  {
    id: 'emerald',
    name: 'Emerald Matrix',
    previewColor: '#059669',
    gradient: 'linear-gradient(135deg, #059669, #0284c7)',
  },
];

export const SettingsDrawer: React.FC = () => {
  const { isSettingsOpen, setIsSettingsOpen, theme, updateTheme, resetToDefaults } = useStore();

  if (!isSettingsOpen) return null;

  const handleReset = () => {
    if (window.confirm('Reset all bookmarks and layout to defaults?')) {
      resetToDefaults();
      toast.info('Preferences reset to default values');
    }
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 120,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSettingsOpen(false)}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        />

        {/* Slide-out Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 240 }}
          className="glass-panel"
          style={{
            width: '100%',
            maxWidth: '380px',
            height: '100%',
            position: 'relative',
            zIndex: 121,
            borderRadius: '24px 0 0 24px',
            borderRight: 'none',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            overflowY: 'auto',
            background: 'rgba(15, 20, 32, 0.88)',
          }}
        >
          {/* Drawer Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '28px',
              paddingBottom: '16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'var(--accent-glow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-primary)',
                }}
              >
                <Sliders size={18} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)' }}>
                Homepage Settings
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', flex: 1 }}>
            {/* Background Theme Selector */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                <Palette size={16} style={{ color: 'var(--accent-primary)' }} />
                <span>Ambient Glass Themes</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {THEME_PRESETS.map((p) => {
                  const isSelected = theme.backgroundTheme === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        updateTheme({ backgroundTheme: p.id });
                        document.body.setAttribute('data-theme', p.id);
                        toast.success(`Theme switched to ${p.name}`);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: isSelected
                          ? 'rgba(168, 85, 247, 0.18)'
                          : 'rgba(255, 255, 255, 0.04)',
                        border: isSelected
                          ? '1px solid var(--accent-primary)'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                        color: 'var(--text-main)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: p.gradient,
                            boxShadow: `0 0 10px ${p.previewColor}88`,
                          }}
                        />
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>{p.name}</span>
                      </div>
                      {isSelected && <Check size={16} style={{ color: 'var(--accent-primary)' }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clock & Header Settings */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                <Clock size={16} style={{ color: 'var(--accent-primary)' }} />
                <span>Clock & Display</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  <span>24-Hour Military Format</span>
                  <input
                    type="checkbox"
                    checked={theme.clockFormat24}
                    onChange={(e) => updateTheme({ clockFormat24: e.target.checked })}
                    style={{ accentColor: 'var(--accent-primary)' }}
                  />
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  <span>Show Digital Seconds</span>
                  <input
                    type="checkbox"
                    checked={theme.showSeconds}
                    onChange={(e) => updateTheme({ showSeconds: e.target.checked })}
                    style={{ accentColor: 'var(--accent-primary)' }}
                  />
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  <span>Show Time Greeting & Date</span>
                  <input
                    type="checkbox"
                    checked={theme.showGreeting}
                    onChange={(e) => updateTheme({ showGreeting: e.target.checked })}
                    style={{ accentColor: 'var(--accent-primary)' }}
                  />
                </label>
              </div>
            </div>

            {/* Widgets Visibility */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                <LayoutTemplate size={16} style={{ color: 'var(--accent-primary)' }} />
                <span>Widgets</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  <span>Weather Status Badge</span>
                  <input
                    type="checkbox"
                    checked={theme.showWeather}
                    onChange={(e) => updateTheme({ showWeather: e.target.checked })}
                    style={{ accentColor: 'var(--accent-primary)' }}
                  />
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  <span>Quick Scratchpad / Tasks</span>
                  <input
                    type="checkbox"
                    checked={theme.showNotesWidget}
                    onChange={(e) => updateTheme({ showNotesWidget: e.target.checked })}
                    style={{ accentColor: 'var(--accent-primary)' }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Reset button at bottom */}
          <div
            style={{
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              marginTop: '20px',
            }}
          >
            <button
              type="button"
              onClick={handleReset}
              className="glass-btn"
              style={{
                width: '100%',
                color: '#f87171',
                borderColor: 'rgba(248, 113, 113, 0.25)',
              }}
            >
              <RotateCcw size={15} />
              <span>Reset to Defaults</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
