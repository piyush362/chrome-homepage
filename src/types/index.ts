export type SearchEngine = 'google' | 'duckduckgo' | 'bing' | 'github' | 'youtube' | 'perplexity';

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  icon?: string; // e.g. "SiGithub", "SiYoutube", "Globe", "Code", etc.
  category?: string;
  color?: string;
  clicks?: number;
}

export type BackgroundTheme = 'aurora' | 'cyberpunk' | 'deepspace' | 'sunset' | 'emerald';

export interface ThemeConfig {
  backgroundTheme: BackgroundTheme;
  glassIntensity: 'subtle' | 'medium' | 'deep';
  clockFormat24: boolean;
  showSeconds: boolean;
  showGreeting: boolean;
  showWeather: boolean;
  showNotesWidget: boolean;
}

export interface QuickNote {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}
