export type SearchEngine = 'google';

export type ThemeMode = 'dark' | 'light';

export type WallpaperPreset = 'twilight' | 'alpine' | 'studio' | 'custom';

export type GridDensity = 'compact' | 'normal' | 'comfortable';

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  faviconUrl?: string;
  iconName?: string;
  color?: string;
  folderId?: string;
  createdAt: number;
}

export interface Folder {
  id: string;
  name: string;
  color?: string;
}

export interface Settings {
  themeMode: ThemeMode;
  wallpaperPreset: WallpaperPreset;
  customWallpaperUrl: string;
  glassOpacity: number; // 0.2 to 0.95
  glassBlur: number; // 6 to 32
  cardRadius: number; // 8 to 28
  accentColor: string;
  gridDensity: GridDensity;
}
