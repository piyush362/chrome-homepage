import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { arrayMove } from '@dnd-kit/sortable';
import type { Bookmark, Folder } from '../types';
import { getFaviconUrl } from '../utils/favicon';

export const INITIAL_FOLDERS: Folder[] = [
  { id: 'general', name: 'General', color: '#8b5cf6' },
  { id: 'work', name: 'Dev & Work', color: '#01875f' },
  { id: 'finance', name: 'Finance & Markets', color: '#2962ff' },
  { id: 'tools', name: 'Tools & Utilities', color: '#e11d48' },
];

export const INITIAL_DEMO_BOOKMARKS: Bookmark[] = [
  {
    id: 'bm-play',
    title: 'Play Console',
    url: 'https://play.google.com/console',
    faviconUrl: getFaviconUrl('https://play.google.com'),
    iconName: 'SiGoogleplay',
    color: '#01875f',
    folderId: 'work',
    createdAt: 1,
  },
  {
    id: 'bm-admob',
    title: 'AdMob',
    url: 'https://admob.google.com',
    faviconUrl: getFaviconUrl('https://admob.google.com'),
    color: '#ea4335',
    folderId: 'work',
    createdAt: 2,
  },
  {
    id: 'bm-firebase',
    title: 'Firebase',
    url: 'https://firebase.google.com',
    faviconUrl: getFaviconUrl('https://firebase.google.com'),
    iconName: 'SiFirebase',
    color: '#ffca28',
    folderId: 'work',
    createdAt: 3,
  },
  {
    id: 'bm-zinghr',
    title: 'ZingHR',
    url: 'https://www.zinghr.com',
    faviconUrl: getFaviconUrl('https://www.zinghr.com'),
    color: '#0052cc',
    folderId: 'work',
    createdAt: 4,
  },
  {
    id: 'bm-gnews',
    title: 'Google News',
    url: 'https://news.google.com',
    faviconUrl: getFaviconUrl('https://news.google.com'),
    iconName: 'SiGooglenews',
    color: '#4285f4',
    folderId: 'general',
    createdAt: 5,
  },
  {
    id: 'bm-ipo',
    title: 'IPO Live',
    url: 'https://www.chittorgarh.com/ipo/',
    faviconUrl: getFaviconUrl('https://www.chittorgarh.com'),
    color: '#e11d48',
    folderId: 'finance',
    createdAt: 6,
  },
  {
    id: 'bm-nse',
    title: 'NSE India',
    url: 'https://www.nseindia.com',
    faviconUrl: getFaviconUrl('https://www.nseindia.com'),
    color: '#ea580c',
    folderId: 'finance',
    createdAt: 7,
  },
  {
    id: 'bm-moneycontrol',
    title: 'Moneycontrol',
    url: 'https://www.moneycontrol.com',
    faviconUrl: getFaviconUrl('https://www.moneycontrol.com'),
    color: '#0284c7',
    folderId: 'finance',
    createdAt: 8,
  },
  {
    id: 'bm-ilovepdf',
    title: 'iLovePDF',
    url: 'https://www.ilovepdf.com',
    faviconUrl: getFaviconUrl('https://www.ilovepdf.com'),
    color: '#e11d48',
    folderId: 'tools',
    createdAt: 9,
  },
  {
    id: 'bm-smallpdf',
    title: 'Smallpdf',
    url: 'https://smallpdf.com',
    faviconUrl: getFaviconUrl('https://smallpdf.com'),
    color: '#0d9488',
    folderId: 'tools',
    createdAt: 10,
  },
  {
    id: 'bm-drive',
    title: 'Drive',
    url: 'https://drive.google.com',
    faviconUrl: getFaviconUrl('https://drive.google.com'),
    iconName: 'SiGoogledrive',
    color: '#34a853',
    folderId: 'tools',
    createdAt: 11,
  },
  {
    id: 'bm-tradingview',
    title: 'TradingView',
    url: 'https://www.tradingview.com',
    faviconUrl: getFaviconUrl('https://www.tradingview.com'),
    iconName: 'SiTradingview',
    color: '#2962ff',
    folderId: 'finance',
    createdAt: 12,
  },
];

interface BookmarkStoreState {
  bookmarks: Bookmark[];
  folders: Folder[];
  activeFolderId: string; // 'all' or folder id
  editingBookmark: Bookmark | null;
  isEditorOpen: boolean;
  isFolderManagerOpen: boolean;

  // Actions
  setActiveFolderId: (id: string) => void;
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => Bookmark;
  updateBookmark: (id: string, updates: Partial<Bookmark>) => void;
  deleteBookmark: (id: string) => void;
  duplicateBookmark: (id: string) => void;
  reorderBookmarks: (activeId: string, overId: string) => void;
  moveBookmarkAccessible: (id: string, direction: 'left' | 'right') => void;

  // Folders
  addFolder: (name: string, color?: string) => Folder;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => { movedCount: number };

  // Editor modal state
  openAddModal: () => void;
  openEditModal: (bookmark: Bookmark) => void;
  closeEditor: () => void;
  setIsFolderManagerOpen: (open: boolean) => void;

  // Reset
  restoreDemoBookmarks: () => void;
}

export const useBookmarkStore = create<BookmarkStoreState>()(
  persist(
    (set, get) => ({
      bookmarks: INITIAL_DEMO_BOOKMARKS,
      folders: INITIAL_FOLDERS,
      activeFolderId: 'all',
      editingBookmark: null,
      isEditorOpen: false,
      isFolderManagerOpen: false,

      setActiveFolderId: (id) => set({ activeFolderId: id }),

      addBookmark: (data) => {
        const newBm: Bookmark = {
          ...data,
          id: `bm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          faviconUrl: getFaviconUrl(data.url, data.faviconUrl),
          folderId: data.folderId || 'general',
          createdAt: Date.now(),
        };
        set((state) => ({ bookmarks: [...state.bookmarks, newBm] }));
        return newBm;
      },

      updateBookmark: (id, updates) => {
        set((state) => ({
          bookmarks: state.bookmarks.map((bm) => {
            if (bm.id !== id) return bm;
            const updatedUrl = updates.url || bm.url;
            return {
              ...bm,
              ...updates,
              faviconUrl: updates.faviconUrl !== undefined
                ? getFaviconUrl(updatedUrl, updates.faviconUrl)
                : bm.faviconUrl,
            };
          }),
        }));
      },

      deleteBookmark: (id) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter((bm) => bm.id !== id),
        }));
      },

      duplicateBookmark: (id) => {
        const item = get().bookmarks.find((bm) => bm.id === id);
        if (!item) return;
        const duplicate: Bookmark = {
          ...item,
          id: `bm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: `${item.title} (Copy)`,
          createdAt: Date.now(),
        };
        const index = get().bookmarks.findIndex((bm) => bm.id === id);
        set((state) => {
          const newBookmarks = [...state.bookmarks];
          newBookmarks.splice(index + 1, 0, duplicate);
          return { bookmarks: newBookmarks };
        });
      },

      reorderBookmarks: (activeId, overId) => {
        set((state) => {
          const oldIndex = state.bookmarks.findIndex((bm) => bm.id === activeId);
          const newIndex = state.bookmarks.findIndex((bm) => bm.id === overId);
          if (oldIndex === -1 || newIndex === -1) return state;
          return { bookmarks: arrayMove(state.bookmarks, oldIndex, newIndex) };
        });
      },

      moveBookmarkAccessible: (id, direction) => {
        set((state) => {
          const currentIndex = state.bookmarks.findIndex((bm) => bm.id === id);
          if (currentIndex === -1) return state;
          const targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
          if (targetIndex < 0 || targetIndex >= state.bookmarks.length) return state;
          return { bookmarks: arrayMove(state.bookmarks, currentIndex, targetIndex) };
        });
      },

      addFolder: (name, color = '#8b5cf6') => {
        const newFolder: Folder = {
          id: `folder-${Date.now()}`,
          name: name.trim(),
          color,
        };
        set((state) => ({ folders: [...state.folders, newFolder] }));
        return newFolder;
      },

      updateFolder: (id, updates) => {
        set((state) => ({
          folders: state.folders.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        }));
      },

      deleteFolder: (id) => {
        const state = get();
        // Safe deletion: move bookmarks in deleted folder to 'general'
        let movedCount = 0;
        const updatedBookmarks = state.bookmarks.map((bm) => {
          if (bm.folderId === id) {
            movedCount++;
            return { ...bm, folderId: 'general' };
          }
          return bm;
        });

        set({
          folders: state.folders.filter((f) => f.id !== id),
          bookmarks: updatedBookmarks,
          activeFolderId: state.activeFolderId === id ? 'all' : state.activeFolderId,
        });

        return { movedCount };
      },

      openAddModal: () => set({ editingBookmark: null, isEditorOpen: true }),
      openEditModal: (bookmark) => set({ editingBookmark: bookmark, isEditorOpen: true }),
      closeEditor: () => set({ editingBookmark: null, isEditorOpen: false }),
      setIsFolderManagerOpen: (open) => set({ isFolderManagerOpen: open }),

      restoreDemoBookmarks: () => {
        set({
          bookmarks: INITIAL_DEMO_BOOKMARKS,
          folders: INITIAL_FOLDERS,
          activeFolderId: 'all',
        });
      },
    }),
    {
      name: 'chrome-homepage-bookmarks',
      version: 3,
      migrate: (persistedState: unknown, version: number) => {
        if (version < 3) {
          return {
            ...(persistedState as Record<string, unknown>),
            bookmarks: INITIAL_DEMO_BOOKMARKS,
            folders: INITIAL_FOLDERS,
          };
        }
        return persistedState;
      },
      storage: createJSONStorage(() => localStorage),
    }
  )
);
