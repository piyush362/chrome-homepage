import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Settings, ThemeMode, WallpaperPreset, GridDensity } from '../types';

export const WALLPAPER_MAP: Record<WallpaperPreset, string> = {
  twilight: "url('/wallpapers/landscape-twilight.jpg')",
  alpine: "url('/wallpapers/landscape-alpine.jpg')",
  aurora: "url('/wallpapers/landscape-aurora.jpg')",
  nebula: "url('/wallpapers/landscape-nebula.jpg')",
  forest: "url('/wallpapers/landscape-forest.jpg')",
  studio: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  custom: '',
};

export const DEFAULT_SETTINGS: Settings = {
  themeMode: 'dark',
  wallpaperPreset: 'twilight',
  customWallpaperUrl: '',
  glassOpacity: 0.65,
  glassBlur: 24,
  cardRadius: 18,
  accentColor: '#8b5cf6',
  gridDensity: 'normal',
};

interface SettingsStoreState {
  settings: Settings;
  isSettingsOpen: boolean;

  // Actions
  updateSettings: (updates: Partial<Settings>) => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  setWallpaperPreset: (preset: WallpaperPreset) => void;
  setGridDensity: (density: GridDensity) => void;
  setIsSettingsOpen: (open: boolean) => void;
  resetSettings: () => void;
  applyCssVariables: () => void;
}

export const useSettingsStore = create<SettingsStoreState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      isSettingsOpen: false,

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
        get().applyCssVariables();
      },

      setThemeMode: (mode) => {
        get().updateSettings({ themeMode: mode });
      },

      toggleThemeMode: () => {
        const next = get().settings.themeMode === 'dark' ? 'light' : 'dark';
        get().updateSettings({ themeMode: next });
      },

      setWallpaperPreset: (preset) => {
        get().updateSettings({ wallpaperPreset: preset });
      },

      setGridDensity: (density) => {
        get().updateSettings({ gridDensity: density });
      },

      setIsSettingsOpen: (open) => set({ isSettingsOpen: open }),

      resetSettings: () => {
        set({ settings: DEFAULT_SETTINGS });
        get().applyCssVariables();
      },

      applyCssVariables: () => {
        const { settings } = get();
        const root = document.documentElement;

        // Apply theme data attributes
        root.setAttribute('data-theme-mode', settings.themeMode);
        root.setAttribute('data-density', settings.gridDensity);

        // Wallpaper resolution
        let wallpaperValue = WALLPAPER_MAP[settings.wallpaperPreset] || WALLPAPER_MAP.twilight;
        if (settings.wallpaperPreset === 'custom' && settings.customWallpaperUrl.trim()) {
          wallpaperValue = `url('${settings.customWallpaperUrl.trim()}')`;
        }
        root.style.setProperty('--bg-wallpaper', wallpaperValue);

        // Dynamic glass properties
        root.style.setProperty('--glass-opacity', settings.glassOpacity.toString());
        root.style.setProperty('--glass-blur', `${settings.glassBlur}px`);
        root.style.setProperty('--card-radius', `${settings.cardRadius}px`);
        root.style.setProperty('--accent-primary', settings.accentColor);
        root.style.setProperty(
          '--accent-glow',
          `${settings.accentColor}40`
        );
      },
    }),
    {
      name: 'chrome-homepage-settings',
      version: 4,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
