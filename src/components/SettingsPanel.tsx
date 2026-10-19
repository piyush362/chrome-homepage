import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Palette,
  Sliders,
  LayoutGrid,
  RotateCcw,
  Check,
  Image as ImageIcon,
  Maximize2,
  Minimize2,
  Smartphone,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSettingsStore } from '../store/useSettingsStore';
import { useBookmarkStore } from '../store/useBookmarkStore';
import { ConfirmDialog } from './ConfirmDialog';
import type { WallpaperPreset, GridDensity } from '../types';

interface WallpaperOption {
  id: WallpaperPreset;
  name: string;
  preview: string;
  isImage?: boolean;
}

const WALLPAPER_PRESETS: WallpaperOption[] = [
  {
    id: 'twilight',
    name: 'Twilight Mist Lake',
    preview: '/wallpapers/landscape-twilight.jpg',
    isImage: true,
  },
  {
    id: 'alpine',
    name: 'Golden Alpine Valley',
    preview: '/wallpapers/landscape-alpine.jpg',
    isImage: true,
  },
  {
    id: 'aurora',
    name: 'Nordic Aurora Borealis',
    preview: '/wallpapers/landscape-aurora.jpg',
    isImage: true,
  },
  {
    id: 'nebula',
    name: 'Cosmic Nebula Peaks',
    preview: '/wallpapers/landscape-nebula.jpg',
    isImage: true,
  },
  {
    id: 'forest',
    name: 'Misty Redwood Sanctuary',
    preview: '/wallpapers/landscape-forest.jpg',
    isImage: true,
  },
  {
    id: 'studio',
    name: 'Deep Studio Slate',
    preview: 'linear-gradient(135deg, #1e293b, #0f172a)',
    isImage: false,
  },
  {
    id: 'custom',
    name: 'Custom Wallpaper URL',
    preview: 'linear-gradient(135deg, #6366f1, #a855f7)',
    isImage: false,
  },
];

const ACCENT_COLORS = [
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#f97316', // Orange
  '#ef4444', // Red
  '#ec4899', // Pink
];

export const SettingsPanel: React.FC = () => {
  const {
    settings,
    isSettingsOpen,
    setIsSettingsOpen,
    updateSettings,
    resetSettings,
  } = useSettingsStore();

  const { restoreDemoBookmarks } = useBookmarkStore();
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(
    typeof document !== 'undefined' ? Boolean(document.fullscreenElement) : false
  );

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
          toast.success('Fullscreen mode enabled (address bar hidden)');
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch {
      toast.error('Fullscreen not supported or allowed by your browser');
    }
  };

  if (!isSettingsOpen) return null;

  const handleConfirmReset = () => {
    resetSettings();
    restoreDemoBookmarks();
    setIsResetConfirmOpen(false);
    toast.success('Homepage reset to factory defaults');
  };

  return (
    <>
      <AnimatePresence>
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
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
              background: 'rgba(0, 0, 0, 0.72)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          />

          {/* Drawer Sheet */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="glass-surface"
            style={{
              width: '100%',
              maxWidth: '390px',
              height: '100%',
              position: 'relative',
              zIndex: 10000,
              borderRadius: '24px 0 0 24px',
              borderRight: 'none',
              display: 'flex',
              flexDirection: 'column',
              padding: '24px',
              overflowY: 'auto',
              background: 'rgba(16, 22, 36, 0.96)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.9)',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--surface-border)',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: 'var(--accent-glow)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-primary)',
                  }}
                >
                  <Sliders size={17} />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-main)' }}>
                  Homepage Customizer
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '8px',
                  width: '30px',
                  height: '30px',
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', flex: 1 }}>
              {/* Theme Mode Toggle */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Theme Mode
                </label>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '6px',
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '4px',
                    borderRadius: '12px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => updateSettings({ themeMode: 'dark' })}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: 'none',
                      background: settings.themeMode === 'dark' ? 'var(--accent-primary)' : 'transparent',
                      color: settings.themeMode === 'dark' ? '#ffffff' : 'var(--text-muted)',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Dark Theme
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSettings({ themeMode: 'light' })}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: 'none',
                      background: settings.themeMode === 'light' ? 'var(--accent-primary)' : 'transparent',
                      color: settings.themeMode === 'light' ? '#ffffff' : 'var(--text-muted)',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Light Theme
                  </button>
                </div>
              </div>

              {/* Landscape Wallpapers */}
              <div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  <ImageIcon size={13} />
                  <span>Landscape Wallpapers</span>
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {WALLPAPER_PRESETS.map((preset) => {
                    const isSelected = settings.wallpaperPreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => updateSettings({ wallpaperPreset: preset.id })}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '14px',
                          border: isSelected
                            ? '1px solid var(--accent-primary)'
                            : '1px solid var(--surface-border-subtle)',
                          background: isSelected ? 'var(--accent-glow)' : 'rgba(255, 255, 255, 0.04)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          color: 'var(--text-main)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '34px',
                              height: '24px',
                              borderRadius: '6px',
                              background: preset.isImage ? `url('${preset.preview}') center/cover` : preset.preview,
                              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                              flexShrink: 0,
                            }}
                          />
                          <span style={{ fontSize: '13px', fontWeight: 500 }}>
                            {preset.name}
                          </span>
                        </div>
                        {isSelected && <Check size={16} style={{ color: 'var(--accent-primary)' }} />}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Wallpaper Input if 'custom' is active */}
                {settings.wallpaperPreset === 'custom' && (
                  <div style={{ marginTop: '10px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        color: 'var(--text-dim)',
                        marginBottom: '4px',
                      }}
                    >
                      Wallpaper Image URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={settings.customWallpaperUrl}
                      onChange={(e) => updateSettings({ customWallpaperUrl: e.target.value })}
                      className="glass-input-field"
                      style={{ fontSize: '12px', padding: '8px 10px' }}
                    />
                  </div>
                )}
              </div>

              {/* Glass Customization Sliders */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Liquid Glass Settings
                </label>

                {/* Glass Opacity */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Opacity</span>
                    <span style={{ fontWeight: 600 }}>{Math.round(settings.glassOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="0.95"
                    step="0.05"
                    value={settings.glassOpacity}
                    onChange={(e) => updateSettings({ glassOpacity: parseFloat(e.target.value) })}
                    style={{ accentColor: 'var(--accent-primary)', width: '100%' }}
                  />
                </div>

                {/* Glass Blur */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Blur Intensity</span>
                    <span style={{ fontWeight: 600 }}>{settings.glassBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="32"
                    step="2"
                    value={settings.glassBlur}
                    onChange={(e) => updateSettings({ glassBlur: parseInt(e.target.value, 10) })}
                    style={{ accentColor: 'var(--accent-primary)', width: '100%' }}
                  />
                </div>

                {/* Corner Radius */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Corner Radius</span>
                    <span style={{ fontWeight: 600 }}>{settings.cardRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="28"
                    step="2"
                    value={settings.cardRadius}
                    onChange={(e) => updateSettings({ cardRadius: parseInt(e.target.value, 10) })}
                    style={{ accentColor: 'var(--accent-primary)', width: '100%' }}
                  />
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  <Palette size={13} />
                  <span>Accent Color</span>
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {ACCENT_COLORS.map((c) => {
                    const isSelected = settings.accentColor === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => updateSettings({ accentColor: c })}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: c,
                          border: isSelected ? '2px solid #ffffff' : 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: isSelected ? `0 0 10px ${c}` : 'none',
                        }}
                      >
                        {isSelected && <Check size={13} color="#ffffff" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grid Density */}
              <div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  <LayoutGrid size={13} />
                  <span>Grid Density</span>
                </label>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '6px',
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '4px',
                    borderRadius: '12px',
                  }}
                >
                  {(['compact', 'normal', 'comfortable'] as GridDensity[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => updateSettings({ gridDensity: d })}
                      style={{
                        padding: '6px 4px',
                        borderRadius: '8px',
                        border: 'none',
                        background: settings.gridDensity === d ? 'var(--accent-primary)' : 'transparent',
                        color: settings.gridDensity === d ? '#ffffff' : 'var(--text-muted)',
                        fontSize: '11px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Address Bar & Fullscreen Mode */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--surface-border)',
                  borderRadius: '14px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Smartphone size={15} style={{ color: 'var(--accent-primary)' }} />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>
                      Hide Address Bar
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="glass-button"
                    style={{
                      padding: '4px 10px',
                      fontSize: '11px',
                      borderRadius: '8px',
                      gap: '4px',
                    }}
                  >
                    {isFullscreen ? (
                      <>
                        <Minimize2 size={12} />
                        <span>Exit</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 size={12} />
                        <span>Full Screen</span>
                      </>
                    )}
                  </button>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-dim)', lineHeight: 1.4 }}>
                  To permanently remove the Chrome address bar on mobile: tap Chrome menu (⋮) → <strong style={{ color: 'var(--text-main)' }}>Add to Home screen</strong> or <strong style={{ color: 'var(--text-main)' }}>Install App</strong>.
                </p>
              </div>

            </div>

            {/* Reset Defaults button */}
            <div
              style={{
                paddingTop: '16px',
                borderTop: '1px solid var(--surface-border)',
                marginTop: '16px',
              }}
            >
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(true)}
                className="glass-button"
                style={{
                  width: '100%',
                  color: '#ef4444',
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                }}
              >
                <RotateCcw size={14} />
                <span>Reset to Factory Defaults</span>
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Reset Homepage?"
        message="This will restore default shortcuts, folders, and appearance settings. Your current customizations will be overwritten."
        confirmLabel="Reset Everything"
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </>
  );
};
