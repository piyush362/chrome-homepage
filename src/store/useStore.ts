import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { arrayMove } from '@dnd-kit/sortable';
import type { Bookmark, SearchEngine, ThemeConfig, QuickNote } from '../types';

interface StoreState {
  // Search
  searchEngine: SearchEngine;
  setSearchEngine: (engine: SearchEngine) => void;

  // Bookmarks
  bookmarks: Bookmark[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'clicks'>) => void;
  updateBookmark: (id: string, data: Partial<Bookmark>) => void;
  deleteBookmark: (id: string) => void;
  reorderBookmarks: (activeId: string, overId: string) => void;
  recordBookmarkClick: (id: string) => void;

  // Theme & Preferences
  theme: ThemeConfig;
  updateTheme: (updates: Partial<ThemeConfig>) => void;

  // Quick Notes
  notes: QuickNote[];
  addNote: (text: string) => void;
  toggleNote: (id: string) => void;
  deleteNote: (id: string) => void;

  // UI state
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;

  // Reset
  resetToDefaults: () => void;
}

export const DEFAULT_BOOKMARKS: Bookmark[] = [
  {
    id: 'bm-1',
    title: 'GitHub',
    url: 'https://github.com',
    icon: 'SiGithub',
    category: 'Development',
    color: '#8b5cf6',
  },
  {
    id: 'bm-2',
    title: 'YouTube',
    url: 'https://youtube.com',
    icon: 'SiYoutube',
    category: 'Media',
    color: '#ef4444',
  },
  {
    id: 'bm-3',
    title: 'Reddit',
    url: 'https://reddit.com',
    icon: 'SiReddit',
    category: 'Social',
    color: '#f97316',
  },
  {
    id: 'bm-4',
    title: 'Google',
    url: 'https://google.com',
    icon: 'SiGoogle',
    category: 'Tools',
    color: '#3b82f6',
  },
  {
    id: 'bm-5',
    title: 'X / Twitter',
    url: 'https://x.com',
    icon: 'SiX',
    category: 'Social',
    color: '#e2e8f0',
  },
  {
    id: 'bm-6',
    title: 'Figma',
    url: 'https://figma.com',
    icon: 'SiFigma',
    category: 'Design',
    color: '#ec4899',
  },
  {
    id: 'bm-7',
    title: 'Notion',
    url: 'https://notion.so',
    icon: 'SiNotion',
    category: 'Productivity',
    color: '#06b6d4',
  },
  {
    id: 'bm-8',
    title: 'Spotify',
    url: 'https://open.spotify.com',
    icon: 'SiSpotify',
    category: 'Media',
    color: '#10b981',
  },
];

export const DEFAULT_THEME: ThemeConfig = {
  backgroundTheme: 'aurora',
  glassIntensity: 'deep',
  clockFormat24: false,
  showSeconds: true,
  showGreeting: true,
  showWeather: true,
  showNotesWidget: true,
};

const DEFAULT_NOTES: QuickNote[] = [
  {
    id: 'note-1',
    text: 'Drag bookmarks to customize your grid order',
    completed: false,
    createdAt: Date.now() - 60000,
  },
  {
    id: 'note-2',
    text: 'Press "/" to immediately focus search bar',
    completed: true,
    createdAt: Date.now() - 30000,
  },
];

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      searchEngine: 'google',
      setSearchEngine: (engine) => set({ searchEngine: engine }),

      bookmarks: DEFAULT_BOOKMARKS,
      activeCategory: 'All',
      setActiveCategory: (cat) => set({ activeCategory: cat }),

      addBookmark: (data) =>
        set((state) => ({
          bookmarks: [
            ...state.bookmarks,
            {
              ...data,
              id: `bm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              clicks: 0,
            },
          ],
        })),

      updateBookmark: (id, data) =>
        set((state) => ({
          bookmarks: state.bookmarks.map((bm) =>
            bm.id === id ? { ...bm, ...data } : bm
          ),
        })),

      deleteBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((bm) => bm.id !== id),
        })),

      reorderBookmarks: (activeId, overId) =>
        set((state) => {
          const oldIndex = state.bookmarks.findIndex((bm) => bm.id === activeId);
          const newIndex = state.bookmarks.findIndex((bm) => bm.id === overId);
          if (oldIndex === -1 || newIndex === -1) return state;
          return {
            bookmarks: arrayMove(state.bookmarks, oldIndex, newIndex),
          };
        }),

      recordBookmarkClick: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.map((bm) =>
            bm.id === id ? { ...bm, clicks: (bm.clicks || 0) + 1 } : bm
          ),
        })),

      theme: DEFAULT_THEME,
      updateTheme: (updates) =>
        set((state) => ({
          theme: { ...state.theme, ...updates },
        })),

      notes: DEFAULT_NOTES,
      addNote: (text) =>
        set((state) => ({
          notes: [
            {
              id: `note-${Date.now()}`,
              text: text.trim(),
              completed: false,
              createdAt: Date.now(),
            },
            ...state.notes,
          ],
        })),

      toggleNote: (id) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, completed: !n.completed } : n
          ),
        })),

      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        })),

      isSettingsOpen: false,
      setIsSettingsOpen: (open) => set({ isSettingsOpen: open }),

      isAddModalOpen: false,
      setIsAddModalOpen: (open) => set({ isAddModalOpen: open }),

      resetToDefaults: () =>
        set({
          searchEngine: 'google',
          bookmarks: DEFAULT_BOOKMARKS,
          theme: DEFAULT_THEME,
          notes: DEFAULT_NOTES,
          activeCategory: 'All',
        }),
    }),
    {
      name: 'chrome-homepage-preferences',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
